const { ERR_MESSAGE } = require('../../constants');

module.exports = (password) => {
    if (password.length < 8 || password.length > 16) {
        return { success: false, message: ERR_MESSAGE.PASSWORD_LENGTH };
    }

    const alphaRegex = /(?=.*[A-Za-z]).{0,}/;
    if (alphaRegex.exec(password) === null) {
        return { success: false, message: ERR_MESSAGE.PASSWORD_ALPHA };
    }

    const numberRegex = /(?=.*[0-9]).{0,}/;
    if (numberRegex.exec(password) === null) {
        return { success: false, message: ERR_MESSAGE.PASSWORD_NUMBER };
    }

    const specialCharacterRegex = /(?=.*\W).{0,}/;
    if (specialCharacterRegex.exec(password) === null) {
        return { success: false, message: ERR_MESSAGE.PASSWORD_SPECIAL_CHAR };
    }

    return { success: true };
};
