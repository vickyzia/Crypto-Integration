const Payment = require('../models/Payment');
const User = require('../models/User');
var transactionStatus = require('../config/transaction-status');

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
                        User.findById(payment._userId).then(user=>{
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
    }
}
