const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateResetPasswordInput = data => {
    let errors = {};
    data.salt = !isEmpty(data.tokenData) ? data.tokenData : '';
    data.token = !isEmpty(data.token) ? data.token : '';
    data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

    if (Validator.isEmpty(data.token)) {
        errors.msg = 'Invalid URL.';
    }

    if (Validator.isEmpty(data.salt)) {
        errors.msg = 'Invalid URL.';
    }

    if (Validator.isEmpty(data.confirmPassword)) {
        errors.msg = 'Confirm New Password field is required';
    }

    if (!Validator.equals(data.newPassword, data.confirmPassword)) {
        errors.msg = 'New Passwords must match';
    }

    if (!Validator.isLength(data.newPassword, {min: 6, max: 30})) {
        errors.msg = 'Password must be at least 6 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
