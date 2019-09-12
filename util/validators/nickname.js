const { ERROR } = require('../../constants');
const DBManager = require('../../service/db-manager');

module.exports = async (nickname) => {
    const regex = /^[가-힣]{1,12}|[a-zA-Z]{1,20}$/;
    if (regex.exec(nickname) === null) {
        const result = { success: false, error: ERROR.NICKNAME_FORMAT };
        return new Promise((reject) => reject(result));
    }

    const whereClause = { field: 'nickname', operator: '==', value: nickname };
    const snapshot = await DBManager.read({ collection: 'users' }, [whereClause]);

    if (!snapshot.empty) {
        const result = { success: false, error: ERROR.NICKNAME_DUPLICATION };
        return new Promise((resolve) => resolve(result));
    }

    return new Promise((resolve) => resolve({ success: true }));
};
