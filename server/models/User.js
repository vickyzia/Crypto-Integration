const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refcode: {
        type: String,
        required: true,
        default: ''
    },
    sponsor: {
        type: String
    },
    hftBal: {
        type: Schema.Types.Decimal128,
        default: 0
    },
    hftBlockchainSent: {
        type: Schema.Types.Decimal128,
        default: 0
    },
    ETH: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    },
    isVerified: { 
        type: Boolean,
        default: false
    }
});

module.exports = User = mongoose.model('users', UserSchema);