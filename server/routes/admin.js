const express = require('express');
const router = express.Router();
const adminValidations = require('../validation/admin');
const paymentValidations = require('../validation/payment');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const BlockchainTransaction = require('../models/BlockchainTransactions');
var payoutTypes = require('../config/payout-types');
var payoutStatuses = require('../config/payout-status');
var paymentStatuses = require('../config/transaction-status');
var paymentProcess = require('../utilities/payments-process');
const Fawn = require('fawn');
const {confirmBlockchainTransaction} = require('../utilities/payments-process')

router.post('/sendUserTokens', (req,res)=>{
    const {errors, isValid} = adminValidations.validateSendTokenObject(req.body);
    var data = req.body;

    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({email: data.userEmail, isEnabled:true})
        .then(user=>{
            if(!user){
                errors.userEmail = "User doesn't exist or is disabled..";
                return res.status(400).json(errors);
            }
            let task = Fawn.Task();
            task.update("users",{_id:user._id},{hftBal: user.hftBal+data.tokenAmount});
            task.save("payouts", {tokens: data.tokenAmount,transactionId: user.email, 
                payoutType: payoutTypes.Admin, payoutStatus: payoutStatuses.Paid, _userId: user._id, 
                createdAt:Date.now()});
            task.run().then(results => {
                return res.status(200).json("Successfully Created");
            }).catch(err=>{
                errors.message = "Error Creating Payout.";
                return res.status(400).json(errors);
            });
        })
        .catch(err => {
            errors.message = "User doesn't exist or is disabled..";
            return res.status(400).json(errors);
        });
});

router.post('/updateUserStatus',(req,res)=>{
    const {errors, isValid} = adminValidations.validateUserEmail(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    var email = req.body.userEmail;
    var enable = req.body.enable;
    if(email == req.body.email){
        errors.message= "User can't update their own status";
        return res.status(400).json(errors);
    }
    User.findOne({email: email})
        .then(user=>{
            user.isEnabled = enable;
            user.save()
                .then(updatedUser => {
                    return res.status(200).json(updatedUser);
                })
                .catch(err=>{
                    errors.error = "Error Updating User.";
                    return res.status(400).json(errors);
                });
        })
        .catch(err => {
            errors.userEmail = "User doesn't exist.";
            return res.status(400).json(errors);
        });
       
});

router.post('/processPayment', (req,res)=>{
    const {errors, isValid} = adminValidations.validateProcessPaymentData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const paymentId = req.body.paymentId;
    Payment.findOne({_id:paymentId, isProcessed:false})
        .then(payment=>{
            User.findById(payment._userId).then(async user=>{
                paymentProcess.updateBalanceAndCreatePayout(user,payment)
                    .then(results => {
                        return res.status(200).json(paymentId);
                    })
                    .catch(err=>{
                        errors.paymentId = "Error processing payment";
                        return res.status(400).json(errors);
                    });
            }).catch(error=>{
                errors.paymentId = "Unable to find user for payment id";
                return res.status(400).json(errors);
            });
        })
        .catch(err => {
            errors.paymentId = "Unable to find payment";
            return res.status(400).json(errors);
        });
});

router.post('/createTransaction', (req,res)=>{
    const {errors, isValid} = adminValidations.validateTransactionInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    let data = req.body;
    BlockchainTransaction.findOne({transactionId: data.transactionId})
        .then(transaction => {
            if(transaction){
                errors.transactionId = "Transaction with id already exists";
                return res.status(400).json(errors);
            }
            User.findOne({email:data.userEmail})
                .then(user=>{
                    let task = Fawn.Task();
                    task.save("blockchaintransactions",{_userId: user._id, transactionId:data.transactionId, tokens:data.tokens,
                        fromAddress: data.fromAddress, toAddress:data.toAddress, createdAt: Date.now(),
                        trasnsactionStatus: paymentStatuses.pending
                    }); 
                    task.update("users",{_id:user._id},{hftPendingBal: user.hftPendingBal+data.tokens});
                    task.run().then(results=>{
                        return res.status(200).json("Transaction created successfully.");
                    }).catch(err=>{
                        errors.err = err;
                        return res.status(400).json(errors);
                    });;
                })
                .catch(err=>{
                    errors.err = err;
                    return res.status(400).json(errors);
                });
        });
});

router.post('/confirmTransaction', (req,res) => {
    const {errors, isValid} = paymentValidations.validateTransactionId(req.body);
    var data = req.body;
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    BlockchainTransaction.findOne({transactionId:data.transactionId, email:data.userEmail})
        .then(payment => {
            if(!payment)
            {
                errors.transactionId = "Transaction Id doesn't exist";
                return res.status(400).json(errors);
            }
            if(payment.transactionStatus == paymentStatuses.cancelled ||
                payment.transactionStatus == paymentStatuses.completed){
                return res.status(200).json(payment);
            }
            confirmBlockchainTransaction(payment).then(tranactionResult=>{
                User.findOne({_id:payment._userId}).then(user=>{
                    let tokens = payment.tokens;
                    const task = Fawn.Task();
                    if(tranactionResult == paymentStatuses.pending){
                        return tranactionResult.status(200).json(payment);
                    }
                    if(tranactionResult == paymentStatuses.completed){
                        user.hftPendingBal  -= tokens;
                        user.hftBlockchainSent += tokens; 
                    }
                    else{
                        user.hftPendingBal -= tokens;
                    }
                    task.update("users",{_id:user._id},{hftPendingBal : user.hftPendingBal,
                         hftBlockchainSent: user.hftBlockchainSent});
                    task.update("blockchaintransactions",{_id:payment._id},{transactionStatus: tranactionResult});
                    task.run().then(results=>{
                        return res.status(200).json(payment);
                    }).catch(err=>{
                        return res.status(500).json("Error in confirmation");
                    });
                }).catch(err=>{
                    console.log(err);
                    errors.err = "Unable to confirming transaction at the moment."
                    return tranactionResult.status(500).json(errors);
                });

            });
        })
        .catch(err=>{
            console.log(err);
            errors.err = "Unable to confirming transaction at the moment."
            return res.status(500).json(errors);
        });
});

router.get('/users', (req,res)=>{
    User.find({email:{$ne:req.body.email}}).then(users=>{
        return res.status(200).json(users);
    }).catch(err=>{
        let errors = {};
        errors.err = err;
        return res.status(500).json({err});
    });
});

router.get('/blockchainTransactions', (req,res)=>{
    BlockchainTransaction.find({},).then(transactions=>{
        return res.status(200).json(transactions);
    }).catch(err=>{
        let errors = {};
        errors.err = err;
        return res.status(500).json(errors);
    });
});

router.get('/payouts', (req,res)=>{
    Payout.find({payoutType: payoutTypes.Admin}).then(payouts=>{
        return res.status(200).json(payouts);
    }).catch(err=>{
        let errors = {};
        errors.err = err;
        return res.status(500).json(errors);
    });
});

router.get('/unprocessedTansactions', (req,res)=>{
    Payment.find({isProcessed: false, transactionStatus: paymentStatuses.completed}).then(payments=>{
        return res.status(200).json(payments);
    }).catch(err=>{
        let errors = {};
        errors.message = err;
        return res.status(500).json(errors);
    });
});

module.exports = router;