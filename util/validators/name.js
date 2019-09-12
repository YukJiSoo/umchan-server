const { ERR_MESSAGE } = require('../../constants');

module.exports = (name) => {
    const regex = /^[가-힣]{2,17}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;
    return regex.exec(name) !== null
        ? { success: true } : { success: false, message: ERR_MESSAGE.NAME_FORMAT };
};
