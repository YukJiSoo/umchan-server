const uuid = require('../util/uuid-creator');

const RUNNINGS_COLLECTION = 'runnings';
const USERS_COLLECTION = 'users';

const resolvers = {
    Mutation: {
        async createRunning(_, args, context) {
            const { name, oneLine, runningDate, registerLimitDate, runningPoints } = args.running;

            try {
                // create
                const id = uuid();

                const userID = '4ea72132dcc985d39418bf90a9c78fcd';
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
                    id,
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