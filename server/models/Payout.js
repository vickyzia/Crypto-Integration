const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const payoutTypes = require('../config/payout-types');
const payoutStatuses = require('../config/payout-status');

const PayoutSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    tokens:{
        type : Number,
        required:true,
        default: 0
    },
    transactionId:{
        type: String,
        required: true
    },
    payoutType:{
        type:String,
        required:true,
        default: payoutTypes.Purchase
    },
    payoutStatus:{
        type: String,
        required:true,
        default: payoutStatuses.Pending
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    completedAt:{
        type: Date,
        required: false
    },
});
module.exports = Payout = mongoose.model('payouts', PayoutSchema);