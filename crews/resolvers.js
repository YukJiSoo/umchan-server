/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
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

async function getDistrictCrewList(context, district) {
    const snapshots = await context.DBManager.read({
        collection: `${district}_crew`,
    });

    const result = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });

    return result;
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
        const crewList = name ? await getDistrictCrewList(context, name) : await getMyCrewList(context, userID);

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
        async crew(_, args, context) {
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
                const crewList = await context.DBManager.read({
                    collection: `${district}_crew`,
                    doc: id,
                });
                const crew = crewList.data();

                const result = {
                    code: 201,
                    success: true,
                    message: 'load crew success',
                    crew,
                };

                console.log(crew);
                const isApplied = crew.awaitMembers.filter((cur) => cur.userID === userID);
                const isMember = crew.members.filter((cur) => cur.userID === userID);
                if (isApplied.length !== 0) result.isApplied = true;
                if (isMember.length !== 0) result.isMember = true;

                return result;
            } catch (error) {
                console.error(`err: crews/resolver.js - crew method ${error.MESSAGE ? error.MESSAGE : error}`);

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
        async applyCrew(_, args, context) {
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

                await context.DBManager.batch(
                    {
                        method: 'update',
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
                            name: data.name,
                            runningDate: data.runningDate,
                            registerLimitDate: data.registerLimitDate,
                            district,
                            id,
                        },
                    },
                );

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
        async goOutCrew(_, args, context) {
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
                const crewList = await context.DBManager.read({
                    collection: `${district}_crew`,
                    doc: id,
                });

                const data = crewList.data();
                const index = data.awaitMembers.findIndex((cur) => cur.userID === userID);
                data.awaitMembers.splice(index, 1);

                const user = await context.DBManager.read({
                    collection: USERS_COLLECTION,
                    doc: userID,
                });

                const userData = user.data();
                const crewIndex = userData.crews.findIndex((cur) => cur.id === id);
                userData.crews.splice(crewIndex, 1);

                await context.DBManager.batch(
                    {
                        method: 'update',
                        collection: `${district}_crew`,
                        doc: id,
                        data,
                    },
                    {
                        method: 'update',
                        collection: USERS_COLLECTION,
                        doc: userID,
                        data: userData,
                    },
                );

                return {
                    code: 201,
                    success: true,
                    message: 'go out crew success',
                };
            } catch (error) {
                console.error(`err: crews/resolver.js - goOutCrew method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
        async disassembleCrew(_, args, context) {
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
                // leader 크루 목록에서 제거
                const user = await context.DBManager.read({
                    collection: USERS_COLLECTION,
                    doc: userID,
                });

                const userData = user.data();
                const crewIndex = userData.crews.findIndex((cur) => cur.id === id);
                userData.crews.splice(crewIndex, 1);

                // 참가자 목록에서 제거
                const crewList = await context.DBManager.read({
                    collection: `${district}_crew`,
                    doc: id,
                });

                const jobs = [];
                const data = crewList.data();
                const { awaitMembers } = data;
                for (const awaitMember of awaitMembers) {
                    const member = await context.DBManager.read({
                        collection: USERS_COLLECTION,
                        doc: awaitMember.userID,
                    });

                    const memberData = member.data();

                    const index = memberData.crews.findIndex((cur) => cur.id === awaitMember.userID);
                    memberData.splice(index, 1);
                    jobs.push({
                        method: 'update',
                        collection: USERS_COLLECTION,
                        doc: awaitMember.userID,
                        data: memberData,
                    });
                }

                const { members } = data;
                for (const member of members) {
                    const memberInfo = await context.DBManager.read({
                        collection: USERS_COLLECTION,
                        doc: member.userID,
                    });

                    const memberData = memberInfo.data();

                    const index = memberData.crews.findIndex((cur) => cur.id === member.userID);
                    memberData.crews.splice(index, 1);
                    jobs.push({
                        method: 'update',
                        collection: USERS_COLLECTION,
                        doc: member.userID,
                        data: memberData,
                    });
                }

                await context.DBManager.batch(
                    {
                        method: 'delete',
                        collection: `${district}_crew`,
                        doc: id,
                    },
                    {
                        method: 'update',
                        collection: USERS_COLLECTION,
                        doc: userID,
                        data: userData,
                    },
                    ...jobs,
                );

                return {
                    code: 201,
                    success: true,
                    message: 'disassemble crew success',
                };
            } catch (error) {
                console.error(`err: crews/resolver.js - disassembleCrew method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
        async acceptCrewMember(_, args, context) {
            const { userID } = context;

            if (!userID) {
                return {
                    code: 401,
                    success: false,
                    message: 'token is null',
                };
            }

            const { id, district, memberID } = args.input;

            try {
                const crewList = await context.DBManager.read({
                    collection: `${district}_crew`,
                    doc: id,
                });

                const data = crewList.data();
                const index = data.awaitMembers.findIndex((cur) => cur.userID === memberID);
                const member = data.awaitMembers[index];

                data.members.push(JSON.parse(JSON.stringify(member)));
                data.awaitMembers.splice(index, 1);

                await context.DBManager.batch(
                    {
                        method: 'update',
                        collection: `${district}_crew`,
                        doc: id,
                        data,
                    },
                );

                return {
                    code: 201,
                    success: true,
                    message: 'accept crew member success',
                };
            } catch (error) {
                console.error(`err: crews/resolver.js - acceptCrewMember method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
        async rejectCrewMember(_, args, context) {
            const { userID } = context;

            if (!userID) {
                return {
                    code: 401,
                    success: false,
                    message: 'token is null',
                };
            }

            const { id, district, memberID } = args.input;

            try {
                const crewList = await context.DBManager.read({
                    collection: `${district}_crew`,
                    doc: id,
                });

                const data = crewList.data();
                const index = data.awaitMembers.findIndex((cur) => cur.userID === memberID);
                data.awaitMembers.splice(index, 1);

                const user = await context.DBManager.read({
                    collection: USERS_COLLECTION,
                    doc: memberID,
                });

                const userData = user.data();
                const crewIndex = userData.crews.findIndex((cur) => cur.id === id);
                userData.crews.splice(crewIndex, 1);

                await context.DBManager.batch(
                    {
                        method: 'update',
                        collection: `${district}_crew`,
                        doc: id,
                        data,
                    },
                    {
                        method: 'update',
                        collection: USERS_COLLECTION,
                        doc: memberID,
                        data: userData,
                    },
                );

                return {
                    code: 201,
                    success: true,
                    message: 'reject crew member success',
                };
            } catch (error) {
                console.error(`err: crews/resolver.js - rejectCrewMember method ${error.MESSAGE ? error.MESSAGE : error}`);

                return {
                    code: error.CODE ? error.CODE : 500,
                    success: false,
                    message: error.MESSAGE ? error.MESSAGE : 'internal server error',
                };
            }
        },
        async exceptCrewMember(_, args, context) {
            const { userID } = context;

            if (!userID) {
                return {
                    code: 401,
                    success: false,
                    message: 'token is null',
                };
            }

            const { id, district, memberID } = args.input;

            try {
                const crewList = await context.DBManager.read({
                    collection: `${district}_crew`,
                    doc: id,
                });

                const data = crewList.data();
                const index = data.members.findIndex((cur) => cur.userID === memberID);
                data.members.splice(index, 1);

                const user = await context.DBManager.read({
                    collection: USERS_COLLECTION,
                    doc: memberID,
                });

                const userData = user.data();
                const crewIndex = userData.crews.findIndex((cur) => cur.id === id);

                if (userData.crews[crewIndex].isChecked) {
                    return {
                        code: 409,
                        success: false,
                        message: '이미 크루원입니다',
                    };
                }

                userData.crews.splice(crewIndex, 1);

                await context.DBManager.batch(
                    {
                        method: 'update',
                        collection: `${district}_crew`,
                        doc: id,
                        data,
                    },
                    {
                        method: 'update',
                        collection: USERS_COLLECTION,
                        doc: memberID,
                        data: userData,
                    },
                );

                return {
                    code: 201,
                    success: true,
                    message: 'except crew member success',
                };
            } catch (error) {
                console.error(`err: crews/resolver.js - exceptCrewMember method ${error.MESSAGE ? error.MESSAGE : error}`);

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
