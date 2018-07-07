const express = require('express');
const validateToken = require('../validation/verify-token');
const paymentValidations = require('../validation/payment');
const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const tokenValue = require('../config/token-value');
const transactionMedium = require('../config/transaction-medium');
const paymentStatus = require('../config/transaction-status');
const coinTypes = require('../config/coin-types');
const Web3 = require('web3');
const router = express.Router();

var Coinpayments = require('coinpayments');
var coinPaymentsClient = new Coinpayments({
    key: '94850cce3d7bbd018077ecf3b8c89315c90836710f1ed4a16f64d1181567380d',
    secret: 'f73f21154c9f00A19DF62C3EA63d1f834aD42afa5c46DeB25f858Cf4F1576Fd9'
  }); 

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
                    Wallet.findOne({publicKey:data.toAddress})
                        .then(wallet=>{
                            if(wallet){
                                newPayment = createPaymentObject(data);
                                newPayment.save()
                                .then(payment=>{
                                    return res.status(200).json(payment);
                                })
                                .catch(err=>{
                                    console.log(err);
                                    error.message = "Unable to create transaction at the moment."
                                    return res.status(500).json(errors);
                                });
                            }else{
                                errors.toAddress = 'Invalid Address for payment to send to.';
                                return res.status(400).json(errors)
                            }
                        });
                }
                else{
                    newPayment = createPaymentObject(data);
                    newPayment.save()
                    .then(payment=>{
                        return res.status(200).json(payment);
                    })
                    .catch(err=>{
                        console.log(err);
                        error.message = "Unable to create transaction at the moment."
                        return res.status(500).json(errors);
                    });
                }
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

router.post('/confirmTransaction',validateToken, (req,res) => {
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
            if(payment.transactionMedium == transactionMedium.metamask)
            {
                return res.status(200).json(confirmMetaMaskPayment(payment));
            }
            else{
                return res.status(200).json(confirmCoinPaymentsPayment(payment));
            }
        })
        .catch(err=>{
            console.log(err);
            errors.message = "Unable to confirming transaction at the moment."
            return res.status(500).json(errors);
        });
});

router.get('/userTransactions', validateToken, (req,res) => {
    var data = req.body;
    var errors = {}
    Payment.find({_userId:data.userId}).sort({createdAt:-1}).exec((err, payments)=>{
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

router.post('/createCoinPaymentsTransaction',validateToken, (req,res)=>{
    const {errors, isValid} = paymentValidations.validateCoinPaymentsTransactionInput(req.body);
    var data = req.body;
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    coinPaymentsClient.createTransaction({
        amount:data.amount,
        currency1:data.currency,
        currency2: data.currency,
        buyer_email: data.email
    },(err,result)=>{
        if(err){
            error.message = err;
            return res.status(400).json(errors);
        }
        var newPayment = new Payment({
            transactionId: result.txn_id,
            paymentType: data.paymentType,
            transactionMedium : transactionMedium.coinpayments,
            tokenValue: tokenValue.getTokenValue(data.paymentType),
            fromAddress: '', //User is yet to send payment so we can't determine the address yet.
            toAddress: result.address,
            statusUrl: result.status_url
        });
        newPayment.save()
            .then(payment=>{
                return res.status(200).json(payment);
            })
            .catch(err=>{
                console.log(err);
                error.message = "Unable to create transaction at the moment."
                return res.status(500).json(errors);
            });
    });
});

module.exports = router;

function confirmMetaMaskPayment(payment) {
    let web3Http = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vNqwZBGAgLsMUml2V9jp"));
    web3Http.eth.getTransactionReceipt(payment.transactionId, function (error, result) {
        if (!error && result) {
            var status = paymentStatus.pending;
            status = result.status == "0x1" ? paymentStatus.completed
                : paymentStatus.cancelled;
            payment.transactionStatus = status;
            Payment.update({ transactionId: payment.transactionId, _userId: payment._userId }, {
                transactionStatus: status,
                completedAt: Date.Now
            }, function (err, affected, resp) {
                return payment;
            });
        }
        else {
            return payment;
        }
    });
}

function confirmCoinPaymentsPayment(payment){
    coinPaymentsClient.getTx(payment.transactionId,(error,result)=>{
        if(!error && result){
            varstatus = result.status == 1 ? paymentStatus.completed
            : result.status==0? paymentStatus.pending:paymentStatus.cancelled;
            payment.transactionStatus = status;
            Payment.update({ transactionId: payment.transactionId, _userId: payment._userId }, {
                transactionStatus: status,
                completedAt: Date.Now
            }, function (err, affected, resp) {
                return payment;
            });
        }
        else{
            return payment;
        }
    });
}
