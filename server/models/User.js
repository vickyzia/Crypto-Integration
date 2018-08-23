const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userRoles = require('../config/roles');
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
        type: Number,
        default: 0
    },
    hftBlockchainSent: {
        type: Number,
        default: 0
    },
    hftPendingBal:{
        type:Number,
        default:0
    },
    ETH: {
        type: String,
        default: ""
    },
    lastUpdatedETH: {
        type: Date
    },
    date: {
        type: Date,
        default: Date.now
    },
    isVerified: { 
        type: Boolean,
        default: false
    },
    role: {
        type:Number,
        default: userRoles.User
    },
    isEnabled: {
        type:Boolean,
        default: true
    },
    resetPassToken: {
        type: String,
        default: ''
    },
    resetTokenCreatedAt:{
        type: Date
    }
});

module.exports = User = mongoose.model('users', UserSchema);