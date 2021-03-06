process.setMaxListeners(20);

const PORT = 3030;

const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const DBManager = require('./service/db-manager');
const jwtManager = require('./util/jwt-manager');

const users = require('./users');
const accounts = require('./accounts');
const runnings = require('./runnings');
const runningHistorys = require('./running-historys');
const crews = require('./crews');
const base = require('./base');

const app = express();

const server = new ApolloServer({
    typeDefs: [
        base.typeDef,
        users.typeDef,
        accounts.typeDef,
        runnings.typeDef,
        crews.typeDef,
        runningHistorys.typeDef,
    ],
    resolvers: [
        users.resolvers,
        accounts.resolvers,
        runnings.resolvers,
        crews.resolvers,
        runningHistorys.resolvers,
    ],

    formatError: (error) => error,

    context: ({ req, res }) => {
        const authorizationHeader = req.headers.authorization || '';
        const token = authorizationHeader.split(' ')[1];
        console.log(token);
        const decoded = jwtManager.isTokenValid(token);
        console.log(decoded);
        const userID = decoded ? decoded.id : undefined;
        console.log(userID);

        return { req, res, DBManager, userID };
    },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => {
    console.log(`app is listening to port ${PORT}`);
});

module.exports = app;
