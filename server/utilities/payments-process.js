const Payment = require('../models/Payment');
const User = require('../models/User');
var transactionStatus = require('../config/transaction-status');
var transactionMediums = require('../config/transaction-medium');
const Web3 = require('web3');
const paymentConfigs = require('../config/payment-configs');
const paymentStatus = require('../config/transaction-status');
const bson = require('bson');
var Coinpayments = require('coinpayments');
var Fawn = require("fawn");
var coinPaymentsClient = new Coinpayments({
    key: '94850cce3d7bbd018077ecf3b8c89315c90836710f1ed4a16f64d1181567380d',
    secret: 'f73f21154c9f00A19DF62C3EA63d1f834aD42afa5c46DeB25f858Cf4F1576Fd9'
  }); 
var payoutTypes = require('../config/payout-types');
var payoutStatuses = require('../config/payout-status');


module.exports={ 
    processPayments(){
        Payment.find({transactionStatus:transactionStatus.completed, isProcessed:false}).exec(async (err, payments)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                if(payments!=null){
                    for(var i=0;i<payments.length;i++){
                        await module.exports.processPayment(payments[i]);
                    }
                }
            }
        });
    },
    async processPayment(payment){
        return new Promise((resolve,reject)=>{
            User.findById(payment._userId).then(user=>{
                module.exports.updateBalanceAndCreatePayout(user,payment)
                    .then(results => {
                        console.log(payment._id + " is sucessfull processed");
                        resolve(true);
                    })
                    .catch(err=>{
                        console.log(payment._id + " threw an error while processing: " + err);
                        resolve(false);
                    });
            }).catch(error=>{
                console.log(error);
                resolve(false);
            });
        });
    },
    async updateBalanceAndCreatePayout(user, payment){
            let tokens = payment.tokens;
            let bonusTokens = payment.bonusTokens;
            let referrals = await module.exports.getReferralUsers(user);
            var task = Fawn.Task();
            task.update("users",{_id:user._id},{hftBal: user.hftBal+tokens+bonusTokens});
            task.save("payouts", {tokens: tokens+ bonusTokens,transactionId:payment.transactionId, 
                payoutType: payoutTypes.Purchase, payoutStatus: payoutStatuses.Paid, _userId: user._id, 
                createdAt:Date.now()});
            if(referrals.referralLevelOne){
                task.update("users",{_id:referrals.referralLevelOne._id},
                    {hftBal: referrals.referralLevelOne.hftBal + (tokens * 0.10)});
                task.save("payouts", {tokens: tokens*0.10,transactionId:user.email, 
                    payoutType: payoutTypes.ReferralLevelOne, payoutStatus: payoutStatuses.Paid, 
                        _userId: referrals.referralLevelOne._id, createdAt:Date.now() });
            }
            if(referrals.referralLevelTwo){
                task.update("users",{_id:referrals.referralLevelTwo._id},
                    {hftBal: referrals.referralLevelTwo.hftBal + (tokens * 0.05)});
                task.save("payouts", {tokens: tokens*0.05,transactionId:user.email, 
                    payoutType: payoutTypes.ReferralLevelTwo, payoutStatus: payoutStatuses.Paid,
                    _userId: referrals.referralLevelTwo._id, createdAt:Date.now()});
            }
            if(referrals.referralLevelThree){
                task.update("users",{_id:referrals.referralLevelThree._id},
                    {hftBal: referrals.referralLevelThree.hftBal + (tokens * 0.03)});
                task.save("payouts", {tokens: tokens*0.03,transactionId:user.email, 
                    payoutType: payoutTypes.ReferralLevelThree, payoutStatus: payoutStatuses.Paid,
                    _userId: referrals.referralLevelThree._id,createdAt:Date.now()});
            }
            task.update("payments", {_id:payment._id},{isProcessed:true});
            return task.run();
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
                    status = result.status == true ? paymentStatus.completed
                        : paymentStatus.cancelled;
                    payment.transactionStatus = status;
                    Payment.update({ transactionId: payment.transactionId, _userId: payment._userId }, {
                        transactionStatus: status,
                        completedAt: Date.now()
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
                        completedAt: Date.now()
                    }, function (err, affected, resp) {
                        return resolve(payment);
                    });
                }
                else{
                    return resolve(payment);
                }
            });
        });
    },
    confirmBlockchainTransaction(transaction) {
        return new Promise((resolve, reject)=>{
            let web3Http = new Web3(new Web3.providers.HttpProvider(paymentConfigs.ETHEREUM_NETWORK));
            web3Http.eth.getTransactionReceipt(transaction.transactionId, function (error, result) {
                var status = paymentStatus.pending;
                if (!error && result) {
                    status = result.status == true ? paymentStatus.completed
                        : paymentStatus.cancelled;
                }
                return resolve(status);
            });}
        );
    },
}
