const uuid = require('../util/uuid-creator');

const RUNNINGS_COLLECTION = 'runnings';
const USERS_COLLECTION = 'users';

const resolvers = {
    Query: {
        async runnings(_, args, context) {
            const { userID } = context;

            if (!userID) {
                return {
                    code: 401,
                    success: false,
                    message: 'token is null',
                };
            }

            try {
                const user = await context.DBManager.read({
                    collection: USERS_COLLECTION,
                    doc: userID,
                });

                const runningIDs = user.data().runnings;

                const runnings = [];
                // eslint-disable-next-line no-restricted-syntax
                for (const runningID of runningIDs) {
                    // eslint-disable-next-line no-await-in-loop
                    const running = await context.DBManager.read({
                        collection: RUNNINGS_COLLECTION,
                        doc: runningID,
                    });
                    const data = running.data();
                    data.id = runningID;
                    runnings.push(data);
                }

                console.log('end');
                return {
                    code: 201,
                    success: true,
                    message: 'load runnings success',
                    runnings,
                };
            } catch (error) {
                console.error(`err: runnings/resolver.js - runnings method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
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

            const { name, oneLine, runningDate, registerLimitDate, runningPoints } = args.running;
            const { nickname } = args;

            try {
                // create
                const id = uuid();

                await context.DBManager.batch(
                    {
                        method: 'create',
                        collection: RUNNINGS_COLLECTION,
                        doc: id,
                        data: {
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
                        },
                    },
                    {
                        method: 'updateArrayField',
                        collection: USERS_COLLECTION,
                        doc: userID,
                        key: 'runnings',
                        value: id,
                        data: {
                            name,
                            oneLine,
                            runningDate,
                            registerLimitDate,
                            runningPoints,
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
    },
};

module.exports = {
    resolvers,
};
