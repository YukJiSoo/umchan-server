const { ERROR } = require('../../constants');

module.exports = (password) => {
    if (password.length < 8 || password.length > 16) {
        return { success: false, error: ERROR.PASSWORD_LENGTH };
    }

    const alphaRegex = /(?=.*[A-Za-z]).{0,}/;
    if (alphaRegex.exec(password) === null) {
        return { success: false, error: ERROR.PASSWORD_ALPHA };
    }

    const numberRegex = /(?=.*[0-9]).{0,}/;
    if (numberRegex.exec(password) === null) {
        return { success: false, error: ERROR.PASSWORD_NUMBER };
    }

    const specialCharacterRegex = /(?=.*\W).{0,}/;
    if (specialCharacterRegex.exec(password) === null) {
        return { success: false, error: ERROR.PASSWORD_SPECIAL_CHAR };
    }

    return { success: true };
};
