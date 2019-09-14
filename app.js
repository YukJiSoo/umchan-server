process.setMaxListeners(20);

const PORT = 3030;

const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const DBManager = require('./service/db-manager');

const users = require('./users');
const accounts = require('./accounts');
const runnings = require('./runnings');
const base = require('./base');

const app = express();

const server = new ApolloServer({
    typeDefs: [
        base.typeDef,
        users.typeDef,
        accounts.typeDef,
        runnings.typeDef,
    ],
    resolvers: [
        users.resolvers,
        accounts.resolvers,
        runnings.resolvers,
    ],

    formatError: (error) => error,

    context: ({ req, res }) => ({ req, res, DBManager }),
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => {
    console.log(`app is listening to port ${PORT}`);
});
