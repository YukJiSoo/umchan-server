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
    });

    return runnings.docs
        .map((doc) => doc.data())
        .filter((running) => running.name.includes(name));
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

            const { id } = args;

            try {
                const running = await context.DBManager.read({
                    collection: RUNNINGS_COLLECTION,
                    doc: id,
                });

                console.log(running.data());
                return {
                    code: 201,
                    success: true,
                    message: 'load running success',
                    running: running.data(),
                };
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
                    organizer: {
                        nickname,
                        userID,
                    },
                    participants: [],
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
                        value: id,
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
    },
};

module.exports = {
    resolvers,
};
