const validators = require('../util/validators');
const jwtManager = require('../util/jwt-manager');

const USERS_COLLECTION = 'users';

const resolvers = {
    Mutation: {
        async login(_, args, context) {
            const { account } = args;

            try {
                // check fields validation
                const id = await validators.loginValidate(account);

                // create token
                const token = await jwtManager.tokenCreator({ id });
                console.log(token);

                const snapshot = await context.DBManager.read(
                    { collection: USERS_COLLECTION, doc: id },
                );
                const user = snapshot.data();

                return {
                    code: 201,
                    success: true,
                    message: 'login user success',
                    token,
                    user,
                };
            } catch (error) {
                console.error(error);
                console.error(`err: account/resolver.js - login resolver ${error.MESSAGE}`);

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
