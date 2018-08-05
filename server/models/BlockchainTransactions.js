const mongoose = require('mongoose');
var transactionStatus = require('../config/transaction-status');

const BlockchainTransactionSchema = new mongoose.Schema({
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
    transactionStatus:{
        type: String,
        required: true,
        default: transactionStatus.pending
    },
    fromAddress:{
        type: String,
        required:true
    },
    toAddress:{
        type: String,
        required:true
    },
    tokens:{
        type:Number,
        required:true
    }
});

module.exports = BlockchainTransaction = mongoose.model('blockchainTransactions', 
    BlockchainTransactionSchema);