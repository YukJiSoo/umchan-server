const { ERR_MESSAGE } = require('../../constants');

module.exports = (email) => {
    const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return regex.exec(email) !== null
        ? { success: true } : { success: false, message: ERR_MESSAGE.EMAIL_FORMAT };
};
