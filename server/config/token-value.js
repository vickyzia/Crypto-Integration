var coinTypes = require('./coin-types')
module.exports = {
    getTokenValue(coinType){
        if(coinType == coinTypes.bitcoin)
            return 1; // change values as required.
        else
            return 1;// change values as required.
    }
};