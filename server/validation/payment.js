const Validator = require('validator');
const isEmpty = require('./is-empty');
const transactionMedium = require('../config/transaction-medium');
const paymentType = require('../config/coin-types');

module.exports ={
    validateTransactionInput : data => {
        let errors = {};
        data.amount = !isEmpty(data.amount) ? data.amount: 0;
        data.fromAddress = !isEmpty(data.fromAddress) ? data.fromAddress : '';
        data.toAddress = !isEmpty(data.toAddress) ? data.toAddress : '';
        data.transactionId = !isEmpty(data.transactionId) ? data.transactionId : '';  
        data.transactionMedium = !isEmpty(data.transactionMedium) ? data.transactionMedium : '';
        //If transaction medium is metamask then payment type can only be ether
        data.paymentType = data.transactionMedium===transactionMedium.metamask?
            paymentType.ether : data.paymentType;
        data.paymentType = !isEmpty(data.paymentType) ? data.paymentType : '';

        
        if(data.amount==0){
            errors.amount = "Amount cannot be empty";
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
        if(!data.transactionMedium || 
            (data.transactionMedium !== transactionMedium.metamask && 
            data.transactionMedium !== transactionMedium.coinpayments)){
            errors.transactionMedium = "Transaction medium should either be metamask or coinpayments"
        }
        if(Validator.isEmpty(data.paymentType) || 
            (!Validator.equals(data.paymentType, paymentType.bitcoin) && 
            !Validator.equals(data.paymentType, paymentType.ether))){
            errors.transactionMedium = "Transaction medium should either be bitcoin or ether"
        }
        return {
            errors,
            isValid: isEmpty(errors)
        };
    },
    validateTransactionId : data => {
        let errors = {};
        data.transactionId = !Validator.isEmpty(data.transactionId)?data.transactionId: '';
        if(Validator.isEmpty(data.transactionId)){
            errors.transactionId = "TransactionId cannot be empty";
        }
        return {
            errors,
            isValid: isEmpty(errors)
        };
    },
    getCurrentEthNetwork : function(){
        
    },
    validateCoinPaymentsTransactionInput = (data)=>{
        data.amount = !isEmpty(data.amount) ? data.amount: 0;
        data.paymentType = !isEmpty(data.currency) ? data.paymentType : '';
        let errors = {};

        if(!Validator.equals(data.paymentType, paymentType.bitcoin) &&
            !Validator.equals(data.paymentType, paymentType.ether)){
                errors.paymentType = "Invalid Currency"
        }
        if(data.amount <= 0){
            errors.amount = "amount should be greater than 0";
        }
        return {
            errors,
            isValid: isEmpty(errors)
        };
    }
}