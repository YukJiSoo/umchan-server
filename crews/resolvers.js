const uuid = require('../util/uuid-creator');

const CREWS_COLLECTION = 'crews';
const USERS_COLLECTION = 'users';

async function getMyCrewList(context, userID) {
    const user = await context.DBManager.read({
        collection: USERS_COLLECTION,
        doc: userID,
    });

    return user.data().crews;
}

async function getSomeCrewList(context, name) {
    const crewList = await context.DBManager.read({
        collection: CREWS_COLLECTION,
    });

    return crewList.docs
        .map((doc) => doc.data())
        .filter((crew) => crew.name.includes(name));
}


async function crews(_, args, context) {
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
        const crewList = name ? await getSomeCrewList(context, name) : await getMyCrewList(context, userID);

        return {
            code: 201,
            success: true,
            message: 'load crews success',
            crews: crewList,
        };
    } catch (error) {
        console.error(`err: crews/resolver.js - crews method ${error.MESSAGE ? error.MESSAGE : error}`);

        return {
            code: error.CODE ? error.CODE : 500,
            success: false,
            message: error.MESSAGE ? error.MESSAGE : 'internal server error',
        };
    }
}

const resolvers = {
    Query: {
        crews,
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

            const { nickname, name, oneLine, creationDate, district } = args.input;

            try {
                // create
                const id = uuid();

                await context.DBManager.batch(
                    {
                        method: 'create',
                        collection: `${district}_crew`,
                        doc: id,
                        data: {
                            name,
                            oneLine,
                            creationDate,
                            leader: {
                                nickname,
                                userID,
                            },
                            members: [],
                            awaitMembers: [],
                            district,
                        },
                    },
                    {
                        method: 'updateArrayField',
                        collection: USERS_COLLECTION,
                        doc: userID,
                        key: 'crews',
                        value: {
                            id,
                            name,
                            district,
                        },
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
