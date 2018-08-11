const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports ={

    validateSendTokenObject : (data) => {
        let errors = {};
        data.userEmail = !isEmpty(data.userEmail)? data.userEmail : "";
        data.tokenAmount = !isEmpty(data.tokenAmount)? Number(data.tokenAmount) : 0;

        if(data.tokenAmount == 0){
            errors.tokenAmount = "Ammount cannot be 0";
        }
        if(isEmpty(data.userEmail) || !Validator.isEmail(data.userEmail)){
            errors.userEmail = "Invalid email";
        }
        return {
            errors,
            isValid: isEmpty(errors)
        };
    },
    validateUserEmail : data => {
        let errors = {};
        data.userEmail = !isEmpty(data.userEmail)? data.userEmail : "";
        if(data.enable == null){
            errors.message= "Please provide data for enable field";
        }
        if(isEmpty(data.userEmail) || !Validator.isEmail(data.userEmail)){
            errors.userEmail = "Invalid email";
        }
        return {
            errors,
            isValid: isEmpty(errors)
        };
    },
    validateProcessPaymentData : data =>{
        let errors = {};
        if(isEmpty(data.paymentId)){
            errors.paymentId = "Invalid Payment Id";
        }
        return {
            errors,
            isValid: isEmpty(errors)
        };
    },
    validateTransactionInput : data => {
        let errors = {};
        data.tokens = !isEmpty(data.tokens) ? data.tokens: 0;
        data.fromAddress = !isEmpty(data.fromAddress) ? data.fromAddress : '';
        data.toAddress = !isEmpty(data.toAddress) ? data.toAddress : '';
        data.transactionId = !isEmpty(data.transactionId) ? data.transactionId : '';  
        data.userEmail = !isEmpty(data.userEmail) ? data.userEmail : '';
        
        if(data.amount==0){
            errors.tokens = "Amount cannot be empty";
        }
        if(Validator.isEmpty(data.fromAddress)){
            errors.fromAddress = "From Address cannot be empty.";
        }
        if(Validator.isEmpty(data.toAddress)){
            errors.toAddress = "To Address cannot be empty.";
        }
        if(Validator.isEmpty(data.transactionId)){
            errors.transactionId = "Transaction Id cannot be empty.";
        }
        if(Validator.isEmpty(data.userEmail)){
            errors.userEmail = "User email should not be empty";
        }
        return {
            errors,
            isValid: isEmpty(errors)
        };
    },
};