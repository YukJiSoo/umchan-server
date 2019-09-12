const { isEmailDuplicate, email } = require('./email');
const password = require('./password');
const name = require('./name');
const { isNicknameDuplicate, nickname } = require('./nickname');
const location = require('./location');

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

module.exports = {
    registerValidate,
};
