const mongoose = require('mongoose');
var coinTypes = require('../config/coin-types');
const Schema = mongoose.Schema;

const WalletSchema = new mongoose.Schema({
    publicKey: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    walletType:{
        type: String,
        required:true,
        default: coinTypes.bitcoin
    }
});

module.exports = Wallet = mongoose.model('wallets', WalletSchema);