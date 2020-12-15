const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateChangePasswordInput = data => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.currentPassword = !isEmpty(data.currentPassword) ? data.currentPassword : '';
    data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
    data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (Validator.isEmpty(data.currentPassword)) {
        errors.currentPassword = 'Current password field is required';
    }

    if (Validator.isEmpty(data.newPassword)) {
        errors.newPassword = 'New Password field is required';
    }

    if (Validator.isEmpty(data.newPassword2)) {
        errors.newPassword2 = 'Confirm New Password field is required';
    }

    if (!Validator.equals(data.newPassword, data.newPassword2)) {
        errors.newPassword2 = 'New Passwords must match';
    }

    if (!Validator.isLength(data.newPassword, {min: 6, max: 30})) {
        errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!Validator.isLength(data.newPassword2, {min: 6, max: 30})) {
        errors.newPassword2 = 'Password must be at least 6 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
