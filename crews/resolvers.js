const uuid = require('../util/uuid-creator');

const CREWS_COLLECTION = 'crews';
const USERS_COLLECTION = 'users';

const resolvers = {
    Query: {
        async crews(_, args, context) {
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

                const crewIDs = user.data().crews;

                const crews = [];
                // eslint-disable-next-line no-restricted-syntax
                for (const crewID of crewIDs) {
                    // eslint-disable-next-line no-await-in-loop
                    const crew = await context.DBManager.read({
                        collection: CREWS_COLLECTION,
                        doc: crewID,
                    });
                    const data = crew.data();
                    data.id = crewID;
                    crews.push(data);
                }

                console.log('end');
                return {
                    code: 201,
                    success: true,
                    message: 'load crews success',
                    crews,
                };
            } catch (error) {
                console.error(`err: crews/resolver.js - crews method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
    },
    Mutation: {
        async createCrew(_, args, context) {
            const { userID } = context;

            if (!userID) {
                return {
                    code: 401,
                    success: false,
                    message: 'token is null',
                };
            }

            const { name, oneLine, creationDate } = args.crew;
            const { nickname } = args;

            try {
                // create
                const id = uuid();
                const imagePath = `crews/${id}`;
                await context.DBManager.batch(
                    {
                        method: 'create',
                        collection: CREWS_COLLECTION,
                        doc: id,
                        data: {
                            name,
                            oneLine,
                            creationDate,
                            imagePath,
                            leader: {
                                nickname,
                                userID,
                            },
                            members: [],
                        },
                    },
                    {
                        method: 'updateArrayField',
                        collection: USERS_COLLECTION,
                        doc: userID,
                        key: 'crews',
                        value: id,
                    },
                );

                return {
                    code: 201,
                    success: true,
                    message: 'create crew success',
                };
            } catch (error) {
                console.error(`err: crews/resolver.js - createCrew method ${error.MESSAGE ? error.MESSAGE : error}`);

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
