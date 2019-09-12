const { ERROR } = require('../../constants');
const DBManager = require('../../service/db-manager');

module.exports.nickname = (nickname) => {
    const regex = /^[가-힣]{1,12}|[a-zA-Z]{1,20}$/;
    return regex.exec(nickname) !== null
        ? { success: true } : { success: false, error: ERROR.NICKNAME_FORMAT };
};

module.exports.isNicknameDuplicate = async (nickname) => {
    try {
        const whereClause = { field: 'nickname', operator: '==', value: nickname };
        const snapshot = await DBManager.read({ collection: 'users' }, [whereClause]);

        if (snapshot.docs) throw ERROR.NICKNAME_DUPLICATION;
        return new Promise((resolve) => resolve());
    } catch (error) {
        console.error(`err: validator/nickname.js - isNicknameDuplicate method ${error.MESSAGE}`);
        return new Promise((_, reject) => reject(error));
    }
};
