const express = require('express');
const validateToken = require('../validation/verify-token');
const paymentValidations = require('../validation/payment');
const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const tokenValue = require('../config/token-value');
const transactionMedium = require('../config/transaction-medium');
const paymentStatus = require('../config/transaction-status');
const coinTypes = require('../config/coin-types');
const web3 = require('web3');
const router = express.Router();

router.post('/createTransaction',validateToken, (req,res)=>{
    const {errors, isValid} = paymentValidations.validateTransactionInput(req.body);
    var data = req.body;
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Payment.findOne({transactionId: data.transactionId})
            .then(payment=>{
                if(payment && payment.paymentType == data.paymentType){
                    errors.transactionId = 'Transaction with this id already exists';
                    return res.status(400).json(errors)
                }
                var newPayment;
                if(data.transactionMedium == transactionMedium.metamask){
                    Wallet.findOne({toAddress:data.toAddress})
                        .then(wallet=>{
                            if(wallet){
                                newPayment = createPaymentObject(data);
                            }else{
                                errors.toAddress = 'Invalid Address for payment to send to.';
                                return res.status(400).json(errors)
                            }
                        })
                }
                else{
                    newPayment = createPaymentObject(data);
                }
                newPayment.save()
                    .then(payment=>{
                        return res.status(200).json(payment);
                    })
                    .catch(err=>{
                        console.log(err);
                        error.message = "Unable to create transaction at the moment."
                        return res.status(500).json(errors);
                    })
            });
});

function createPaymentObject(data){
    const payment = new Payment({
        _userId: data.userId,
        transactionId: data.transactionId,
        paymentType: data.paymentType,
        amount :data.amount,
        fromAddress : data.fromAddress,
        toAddress : data.toAddress,
        transactionMedium: data.transactionMedium,
        tokenValue : tokenValue.getTokenValue(data.paymentType)
    })
    return payment;
};

router.get('/confirmTransaction',validateToken, (req,res) => {
    const {errors, isValid} = paymentValidations.validateTransactionId(req.body);
    var data = req.body;
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Payment.findOne({transactionId:data.transactionId, _userId:data.userId})
        .then(payment => {
            if(!payment)
            {
                error.transactionId = "Transaction Id doesn't exist";
                return res.status(400).json(errors);
            }
            
            if(payment.transactionStatus == paymentStatus.cancelled ||
                payment.transactionStatus == paymentStatus.completed){
                return res.status(200).json(payment);
            }
            web3Http = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vNqwZBGAgLsMUml2V9jp"));
            web3Http.eth.getTransactionReciept(data.transactionId, function(error, res){
                if(!error){
                    var status = paymentStatus.pending;
                    if(res){
                        status = res.status == "0x1" ? paymentStatus.completed
                            :paymentStatus.cancelled;
                        payment.transactionStatus = status;
                        Payment.update({transactionId:data.transactionId, _userId:data.userId},{
                            transactionStatus : status,
                            completedAt: Date.Now
                        }, function(err,affected,resp){
                            console.log(resp);
                        });
                    }
                }
                else{
                    console.log(error);
                }
                return res.status(200).json(payment);
            })
        })
        .catch(err=>{
            console.log(err);
            error.message = "Unable to create transaction at the moment."
            return res.status(500).json(errors);
        });
});

router.get('/userTransactions', validateToken, (req,res) => {
    var data = req.body;
    var errors = {}
    Payment.find({_userId:data.userId}).sort({createdAt:-1}),exec((err, payments)=>{
        if(err)
        {
            errors.message = err;
            return res.status(500).json(errors);
        }
        return res.status(200).json(payments);
    });
});

//Load Token Value in BTC and Ether as well as Wallet Address list to work with MetaMask
router.get('/loadPaymentData',validateToken, (req,res)=>{
    var payload = {};
    var errors = {};
    payload.BtcTokenValue = tokenValue.getTokenValue(coinTypes.bitcoin);
    payload.EtherTokenValue = tokenValue.getTokenValue(coinTypes.ether);
    Wallet.find({},'publicKey',function(err,wallets){
        if(err){
            errors.message = err;
            return res.status(500).json(errors);
        }
        payload.wallets = wallets;
        return res.status(200).json(payload);
    })
});

module.exports = router;