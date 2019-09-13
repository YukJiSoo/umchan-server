const { ERROR } = require('../../constants');
const DBManager = require('../../service/db-manager');
const { checkCorrectPassword } = require('../../util/password-encrypto');

module.exports.email = (email) => {
    const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    return regex.exec(email) !== null
        ? { success: true } : { success: false, error: ERROR.EMAIL_FORMAT };
};

module.exports.isAccountMatch = async (account) => {
    try {
        // check email exist
        const whereClause = { field: 'email', operator: '==', value: account.email };
        const snapshot = await DBManager.read({ collection: 'accounts' }, [whereClause]);

        if (snapshot.empty) throw ERROR.ACCOUNT_NO_MATCH_EMAIL;

        // check correct password
        const { salt } = snapshot.docs[0].data();
        const isPasswordValidate = await checkCorrectPassword(account.password, salt);
        if (!isPasswordValidate) throw ERROR.ACCOUNT_NO_MATCH_PASSWORD;

        return new Promise((resolve) => resolve());
    } catch (error) {
        console.error(`err: validator/email.js - isEmailDuplicate method ${error.MESSAGE}`);
        return new Promise((_, reject) => reject(error));
    }
};
