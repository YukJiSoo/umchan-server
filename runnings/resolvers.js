const uuid = require('../util/uuid-creator');

const RUNNINGS_COLLECTION = 'runnings';
const USERS_COLLECTION = 'users';

async function getMyRunningList(context, userID) {
    const runningList = [];

    const user = await context.DBManager.read({
        collection: USERS_COLLECTION,
        doc: userID,
    });

    const runningIDs = user.data().runnings;

    // eslint-disable-next-line no-restricted-syntax
    for (const runningID of runningIDs) {
        // eslint-disable-next-line no-await-in-loop
        const running = await context.DBManager.read({
            collection: RUNNINGS_COLLECTION,
            doc: runningID,
        });
        const data = running.data();
        data.id = runningID;
        runningList.push(data);
    }

    return runningList;
}

async function getSomeRunningList(context, name) {
    const runnings = await context.DBManager.read({
        collection: RUNNINGS_COLLECTION,
        doc: name,
    });

    const result = [];
    const datas = runnings.data();

    // eslint-disable-next-line no-restricted-syntax
    for (const key in datas) {
        const data = datas[key];
        data.id = key;
        result.push(data);
    }
    return result;
}

const runnings = async (_, args, context) => {
    const { userID } = context;

    if (!userID) {
        return {
            code: 401,
            success: false,
            message: 'token is null',
        };
    }

    const { name } = args;

    try {
        const runningList = name ? await getSomeRunningList(context, name) : await getMyRunningList(context, userID);

        return {
            code: 201,
            success: true,
            message: 'load runnings success',
            runnings: runningList,
        };
    } catch (error) {
        console.error(`err: runnings/resolver.js - runnings method ${error.MESSAGE ? error.MESSAGE : error}`);

        return {
            code: error.CODE ? error.CODE : 500,
            success: false,
            message: error.MESSAGE ? error.MESSAGE : 'internal server error',
        };
    }
};

const resolvers = {
    Query: {
        runnings,
        async running(_, args, context) {
            const { userID } = context;

            if (!userID) {
                return {
                    code: 401,
                    success: false,
                    message: 'token is null',
                };
            }

            const { id, district } = args.input;

            try {
                const runningList = await context.DBManager.read({
                    collection: RUNNINGS_COLLECTION,
                    doc: district,
                });
                const running = runningList.data()[id];

                const result = {
                    code: 201,
                    success: true,
                    message: 'load running success',
                    running,
                };

                const isApplied = running.awaitMembers.filter((cur) => cur.userID === userID);
                const isMember = running.members.filter((cur) => cur.userID === userID);
                if (isApplied.length !== 0) result.isApplied = true;
                if (isMember.length !== 0) result.isMember = true;

                return result;
            } catch (error) {
                console.error(`err: runnings/resolver.js - running method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
    },
    Mutation: {
        async createRunning(_, args, context) {
            const { userID } = context;

            if (!userID) {
                return {
                    code: 401,
                    success: false,
                    message: 'token is null',
                };
            }

            const { name, oneLine, runningDate, registerLimitDate, runningPoints, district } = args.running;
            const { nickname } = args;

            try {
                // create
                const id = uuid();

                const data = {};
                data[id] = {
                    name,
                    oneLine,
                    runningDate,
                    registerLimitDate,
                    runningPoints,
                    leader: {
                        name,
                        nickname,
                        district,
                        userID,
                    },
                    members: [],
                    district,
                };

                await context.DBManager.batch(
                    {
                        method: 'update',
                        collection: RUNNINGS_COLLECTION,
                        doc: district,
                        data,
                    },
                    {
                        method: 'updateArrayField',
                        collection: USERS_COLLECTION,
                        doc: userID,
                        key: 'runnings',
                        value: {
                            district,
                            id,
                        },
                    },
                );

                return {
                    code: 201,
                    success: true,
                    message: 'create running success',
                };
            } catch (error) {
                console.error(`err: runnings/resolver.js - createRunning method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
        async applyRunning(_, args, context) {
            const { userID } = context;

            if (!userID) {
                return {
                    code: 401,
                    success: false,
                    message: 'token is null',
                };
            }

            const { id, district, user } = args.input;

            try {
                const runningList = await context.DBManager.read({
                    collection: RUNNINGS_COLLECTION,
                    doc: district,
                });
                const data = {};
                data[id] = runningList.data()[id];

                const isApplied = data[id].awaitMembers.filter((cur) => cur.userID === userID);
                if (isApplied.length !== 0) {
                    return {
                        code: 409,
                        success: false,
                        message: 'already applied to this running',
                    };
                }

                const isMember = data[id].members.filter((cur) => cur.userID === userID);
                if (isMember.length !== 0) {
                    return {
                        code: 409,
                        success: false,
                        message: 'already participated to this running',
                    };
                }

                user.userID = userID;
                data[id].awaitMembers.push(user);

                await context.DBManager.update({
                    collection: RUNNINGS_COLLECTION,
                    doc: district,
                    data,
                });

                return {
                    code: 201,
                    success: true,
                    message: 'apply running success',
                };
            } catch (error) {
                console.error(`err: runnings/resolver.js - applyRunning method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
    },
};

module.exports = {
    resolvers,
};
