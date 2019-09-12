const { ERROR } = require('../../constants');
const DBManager = require('../../service/db-manager');

module.exports.email = (email) => {
    const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    return regex.exec(email) !== null
        ? { success: true } : { success: false, error: ERROR.EMAIL_FORMAT };
};

module.exports.isEmailDuplicate = async (email) => {
    try {
        const whereClause = { field: 'email', operator: '==', value: email };
        const snapshot = await DBManager.read({ collection: 'accounts' }, [whereClause]);

        if (snapshot.docs) throw ERROR.EMAIL_DUPLICATION;
        return new Promise((resolve) => resolve());
    } catch (error) {
        console.error(`err: validator/email.js - isEmailDuplicate method ${error.MESSAGE}`);
        return new Promise((_, reject) => reject(error));
    }
};
