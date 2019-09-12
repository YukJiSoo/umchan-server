const { ERR_MESSAGE } = require('../../constants');
const DBManager = require('../../service/db-manager');

module.exports = async (email) => {
    const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (regex.exec(email) === null) {
        const result = { success: false, message: ERR_MESSAGE.EMAIL_FORMAT };
        return new Promise((reject) => reject(result));
    }

    const whereClause = { field: 'email', operator: '==', value: email };
    const snapshot = await DBManager.read({ collection: 'account' }, [whereClause]);

    if (!snapshot.empty) {
        const result = { success: false, message: ERR_MESSAGE.EMAIL_DUPLICATION };
        return new Promise((resolve) => resolve(result));
    }

    return new Promise((resolve) => resolve({ success: true }));
};
