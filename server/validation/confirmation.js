const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateConfirmationInput = data => {
    let errors = {};
    data.regemail = !isEmpty(data.email) ? data.email : '';
    if (!Validator.isEmail(data.regemail)) {
        errors.msg = 'Email is invalid';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};