const RUNNING_HISTORYS_COLLECTION = 'runningHistorys';

async function getMyRunningHistoryList(context, userID) {
    const fetchResult = await context.DBManager.read({
        collection: RUNNING_HISTORYS_COLLECTION,
        doc: userID,
    });

    const runningHistoryObject = fetchResult.data();
    const values = Object.values(runningHistoryObject);
    const keys = Object.keys(runningHistoryObject);

    return values.map((value, index) => {
        value.id = keys[index];
        return value;
    });
}

const runningHistorys = async (_, args, context) => {
    const { userID } = context;

    if (!userID) {
        return {
            code: 401,
            success: false,
            message: 'token is null',
        };
    }

    try {
        const runningHistoryList = await getMyRunningHistoryList(context, userID);

        return {
            code: 201,
            success: true,
            message: 'load running historys success',
            runningHistroys: runningHistoryList,
        };
    } catch (error) {
        console.error(`err: running-histroy/resolver.js - runningHistorys method ${error.MESSAGE ? error.MESSAGE : error}`);

        return {
            code: error.CODE ? error.CODE : 500,
            success: false,
            message: error.MESSAGE ? error.MESSAGE : 'internal server error',
        };
    }
};

const resolvers = {
    Query: {
        runningHistorys,
    },
};

module.exports = {
    resolvers,
};
