const Payment = require('../models/Payment');
const User = require('../models/User');
var transactionStatus = require('../config/transaction-status');
var transactionMediums = require('../config/transaction-medium');
const Web3 = require('web3');
const paymentConfigs = require('../config/payment-configs');
const paymentStatus = require('../config/transaction-status');
const bson = require('bson');
var Coinpayments = require('coinpayments');
var coinPaymentsClient = new Coinpayments({
    key: '94850cce3d7bbd018077ecf3b8c89315c90836710f1ed4a16f64d1181567380d',
    secret: 'f73f21154c9f00A19DF62C3EA63d1f834aD42afa5c46DeB25f858Cf4F1576Fd9'
  }); 
module.exports={ 
    processPayments(){
        Payment.find({transactionStatus:transactionStatus.completed, isProcessed:false}).exec((err, payments)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                if(payments!=null){
                    payments.forEach(payment => {
                        let totalTokens = payment.tokens + payment.bonusTokens;
                        User.findById(payment._userId).then(async user=>{
                            let referrals = await module.exports.getReferralUsers(user);
                            //Update user balance and save 
                            //if one save fails revert all.
                            user.hftBal += totalTokens;
                            payment.isProcessed = true;
                            payment.save((errP,updatedPayment)=>{
                                if(errP){
                                    console.log(errP);
                                }
                                else{
                                    user.save((errU,updatedUser)=>{
                                        if(errU){
                                            payment.isProcessed = false;
                                            payment.save((errAgain,updatedP)=>{
                                                if(errAgain)
                                                    console.log("Error with transaction.");
                                            });
                                        }
                                        else{
                                            console.log("Process Complete for payment: "+ payment._id);
                                        }
                                    });
                                }
                            });                    
                        }).catch(error=>{
                            console.log(error);
                        });
                    });
                }
            }
        });
    },
    updateBalanceAndCreatePayout(user, referrals, tokens, bonusTokens){
        return new Promise((resolve, reject) => {
            let completed = [];
            user.tokens = tokens + bonusTokens;
            if(referrals.referralLevelOne != null){
                referrals.referralLevelOne.tokens = tokens * 0.10;
            }
        });
    },
    createPayout(user, transactionId, tokens){

    },
    getReferralUsers(user){
        return new Promise((resolve,reject)=>{
            let referrals = {};
            User.findOne({refcode: user.sponsor}).then(ref1 => {
                if(!ref1){
                    resolve(referrals);
                    return;
                }
                referrals.referralLevelOne = ref1;
                User.findOne({refcode:ref1.sponsor}).then(ref2 => {
                    if(!ref2){
                        resolve(referrals);
                        return;
                    }
                    referrals.referralLevelTwo = ref2;
                    User.findOne({refcode: ref2.sponsor}).then(ref3=>{
                        if(!ref3){
                            resolve(referrals);
                            return;
                        }
                        referrals.referralLevelThree = ref3;
                        resolve(referrals);
                    }).catch(err=>{ resolve(referrals)});
                }).catch(err=>{
                    resolve(referrals);
                })
            }).catch(err =>{
                resolve(referrals);
            });
        });
    },
    async confirmTransactions(){
        return new Promise((resolve, reject)=>{
            Payment.find({transactionStatus:transactionStatus.pending}).exec((err, payments)=>{
                if(err)
                {
                    console.log(err);
                    reject();
                }
                else{
                    if(payments!=null && payments.length>0){
                        var itemsProcessed = 0;
                        payments.reduce(async ( promise, payment )  => {
                            await promise;
                            var updatedPayment = await module.exports.confirmTransaction(payment);
                            if(updatedPayment.transactionStatus == transactionStatus.completed)
                                console.log("Transaction marked complete for: " + updatedPayment.transactionId);
                            if(updatedPayment.transactionStatus == transactionStatus.pending)
                                console.log("Transaction Status still pending for: " + updatedPayment.transactionId);
                            if(updatedPayment.transactionStatus == transactionStatus.cancelled)
                                console.log("Transaction Status cancelled for: " + updatedPayment.transactionId);
                            itemsProcessed++;
                            if(payments.length == itemsProcessed ){
                                resolve();
                            }
                        }, Promise.resolve());
                     }
                    else{
                        resolve();
                    }
                }
            });
        });
    },
    confirmTransaction(payment){
        if(payment.transactionMedium == transactionMediums.metamask){
            return module.exports.confirmMetaMaskPayment(payment);
        }
        else{
            return module.exports.confirmCoinPaymentsPayment(payment);
        }
    },
    confirmMetaMaskPayment(payment) {
        return new Promise((resolve, reject)=>{
            let web3Http = new Web3(new Web3.providers.HttpProvider(paymentConfigs.ETHEREUM_NETWORK));
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
                        if(err)
                            console.log(err);
                        return resolve(payment);
                    });
                }
                else {
                    return resolve(payment);
                }
            });}
        );
    },
    confirmCoinPaymentsPayment(payment){
        return new Promise((resolve, reject) => {
            coinPaymentsClient.getTx(payment.transactionId,(error,result)=>{
                if(!error && result){
                    var status = result.status == 1 || result.status == 100? paymentStatus.completed
                    : result.status==0? paymentStatus.pending:paymentStatus.cancelled;
                    payment.transactionStatus = status;
                    Payment.update({ transactionId: payment.transactionId, _userId: payment._userId }, {
                        transactionStatus: status,
                        completedAt: Date.Now
                    }, function (err, affected, resp) {
                        return resolve(payment);
                    });
                }
                else{
                    return resolve(payment);
                }
            });
        });
    }
}
