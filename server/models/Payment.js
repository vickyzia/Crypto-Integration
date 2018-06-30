const mongoose = require('mongoose');
var coinTypes = require('../config/coin-types');
var transactionStatus = require('../config/transaction-status');
var transactionMedium = require('../config/transaction-medium');
const Schema = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    transactionId: {
        type: String,
        required: true 
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    completedAt:{
        type: Date,
        required: false
    },
    paymentType:{
        type: String,
        required: true,
        default: coinTypes.bitcoin
    },
    transactionStatus:{
        type: String,
        required: true,
        default: transactionStatus.pending
    },
    transactionMedium:{
        type: String,
        default: transactionMedium.metamask
    },
    tokenValue:{
        type: Number,
        default: 1.0
    },
    fromAddress:{
        type: String,
        required:true
    },
    toAddress:{
        type: String,
        required:true
    },
    amount:{
        type: Number,
        required: true
    }
});

module.exports = Payment = mongoose.model('payments', PaymentSchema);