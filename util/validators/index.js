const { isEmailDuplicate, email } = require('./email');
const password = require('./password');
const name = require('./name');
const { isNicknameDuplicate, nickname } = require('./nickname');
const location = require('./location');
const { isAccountMatch } = require('./account');

const registerValidate = async (validateValue) => {
    const fieldsNeedToValidate = [
        { value: validateValue.email, validator: email },
        { value: validateValue.password, validator: password },
        { value: validateValue.name, validator: name },
        { value: validateValue.nickname, validator: nickname },
        { value: validateValue.location, validator: location },
    ];

    try {
        // check email duplicate
        await isEmailDuplicate(validateValue.email);
        await isNicknameDuplicate(validateValue.nickname);

        fieldsNeedToValidate.forEach(async (field) => {
            const { validator, value } = field;
            const result = validator(value);

            if (!result.success) throw result.error;
        });

        return new Promise((resolve) => resolve());
    } catch (error) {
        return new Promise((_, reject) => reject(error));
    }
};

const loginValidate = async (account) => {
    const fieldsNeedToValidate = [
        { value: account.email, validator: email },
        { value: account.password, validator: password },
    ];

    try {
        // check account duplicate
        await isAccountMatch(account);

        fieldsNeedToValidate.forEach(async (field) => {
            const { validator, value } = field;
            const result = validator(value);

            if (!result.success) throw result.error;
        });

        return new Promise((resolve) => resolve());
    } catch (error) {
        return new Promise((_, reject) => reject(error));
    }
};

module.exports = {
    registerValidate,
    loginValidate,
};
