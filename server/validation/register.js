const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateRegisterInput = data => {
    let errors = {};

    data.regemail = !isEmpty(data.email) ? data.email : '';
    data.regemail2 = !isEmpty(data.email2) ? data.email2 : '';
    data.regpassword = !isEmpty(data.password) ? data.password : '';
    data.regpassword2 = !isEmpty(data.password2) ? data.password2 : '';

    if (!Validator.isEmail(data.regemail)) {
        errors.regemail = 'Email is invalid';
    }

    if (Validator.isEmpty(data.regemail)) {
        errors.regemail = 'Email field is required';
    }

    if (!Validator.equals(data.regemail, data.regemail2)) {
        errors.regemail2 = 'Mails must match';
    }

    if (!Validator.isEmail(data.regemail2)) {
        errors.regemail2 = 'Confirm Email is invalid';
    }

    if (Validator.isEmpty(data.regemail2)) {
        errors.regemail2 = 'Confirm Email field is required';
    }

    if (!Validator.isLength(data.regpassword, {min: 6, max: 30})) {
        errors.regpassword = 'Password must be at least 6 characters';
    }

    if (Validator.isEmpty(data.regpassword)) {
        errors.regpassword = 'Password field is required';
    }

    if (!Validator.equals(data.regpassword, data.regpassword2)) {
        errors.regpassword2 = 'Passwords must match';
    }

    if (Validator.isEmpty(data.regpassword2)) {
        errors.regpassword2 = 'Confirm Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};