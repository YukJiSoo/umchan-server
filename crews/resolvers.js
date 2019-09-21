const uuid = require('../util/uuid-creator');

const CREWS_COLLECTION = 'crews';
const USERS_COLLECTION = 'users';

async function getMyCrewList(context, userID) {
    const crewList = [];

    const user = await context.DBManager.read({
        collection: USERS_COLLECTION,
        doc: userID,
    });

    const crewIDs = user.data().crews;

    // eslint-disable-next-line no-restricted-syntax
    for (const crewID of crewIDs) {
        // eslint-disable-next-line no-await-in-loop
        const crew = await context.DBManager.read({
            collection: CREWS_COLLECTION,
            doc: crewID,
        });
        const data = crew.data();
        data.id = crewID;
        crewList.push(data);
    }

    return crewList;
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
