const validators = require('../util/validators');
const uuid = require('../util/uuid-creator');
const passwordEncrypto = require('../util/password-encrypto');
const jwtManager = require('../util/jwt-manager');

const USERS_COLLECTION = 'users';
const ACCOUNTS_COLLECTION = 'accounts';

const resolvers = {
    Query: {
    },
    Mutation: {
        async register(_, args, context) {
            const { email, password, name, nickname, location } = args.user;

            try {
                // check fields validation
                await validators.registerValidate(args.user);

                // create
                const id = uuid();
                const { passwordKey, salt } = await passwordEncrypto(password);
                const token = await jwtManager.tokenCreator({ id });

                await context.DBManager.batch(
                    {
                        method: 'create',
                        collection: USERS_COLLECTION,
                        doc: id,
                        data: {
                            id,
                            name,
                            nickname,
                            imagePath: `baseurl(todo)${id}`,
                            location,
                        },
                    },
                    {
                        method: 'create',
                        collection: ACCOUNTS_COLLECTION,
                        doc: id,
                        data: {
                            id,
                            email,
                            passwordKey,
                            salt,
                        },
                    },
                );

                return {
                    code: 201,
                    success: true,
                    message: 'register user success',
                    token,
                };
            } catch (error) {
                console.error(`err: users/resolver.js - register method ${error.MESSAGE}`);

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
