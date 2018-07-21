const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateUpdateWalletInput = data => {
    let errors = {};

    data.wallet = !isEmpty(data.wallet) ? data.wallet : '';

    if (Validator.isEmpty(data.wallet)) {
        errors.wallet = 'Wallet address is required!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
