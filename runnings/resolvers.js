const uuid = require('../util/uuid-creator');

const USERS_COLLECTION = 'users';

async function getMyRunningList(context, userID) {
    const user = await context.DBManager.read({
        collection: USERS_COLLECTION,
        doc: userID,
    });

    return user.data().runnings;
}

async function getDistrictRunningList(context, name) {
    const snapshots = await context.DBManager.read({
        collection: name,
    });

    const result = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });

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
        const runningList = name ? await getDistrictRunningList(context, name) : await getMyRunningList(context, userID);

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
            console.log(id, district);
            try {
                const runningList = await context.DBManager.read({
                    collection: district,
                    doc: id,
                });
                const running = runningList.data();

                const result = {
                    code: 201,
                    success: true,
                    message: 'load running success',
                    running,
                };

                console.log(running);
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

                const data = {
                    name,
                    oneLine,
                    runningDate,
                    registerLimitDate,
                    runningPoints,
                    leader: {
                        name,
                        nickname,
                        userID,
                        district,
                    },
                    members: [],
                    district,
                };

                await context.DBManager.batch(
                    {
                        method: 'create',
                        collection: district,
                        doc: id,
                        data,
                    },
                    {
                        method: 'updateArrayField',
                        collection: USERS_COLLECTION,
                        doc: userID,
                        key: 'runnings',
                        value: {
                            name,
                            runningDate,
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
                    collection: district,
                    doc: id,
                });
                const data = runningList.data();

                const isApplied = data.awaitMembers.filter((cur) => cur.userID === userID);
                if (isApplied.length !== 0) {
                    return {
                        code: 409,
                        success: false,
                        message: 'already applied to this running',
                    };
                }

                const isMember = data.members.filter((cur) => cur.userID === userID);
                if (isMember.length !== 0) {
                    return {
                        code: 409,
                        success: false,
                        message: 'already participated to this running',
                    };
                }

                user.userID = userID;
                data.awaitMembers.push(user);

                await context.DBManager.update({
                    collection: district,
                    doc: id,
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
