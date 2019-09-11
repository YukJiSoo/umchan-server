const PORT = 3030;

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const tests = [
    {
        content: 'graphql',
    },
    {
        content: 'express',
    },
];

const typeDefs = gql`
    type Test {
        content: String
    }

    type Query {
        tests: [Test]
    }
`;

const resolvers = {
    Query: {
        tests: () => tests,
    },
};

const server = new ApolloServer({
    typeDefs: [typeDefs],
    resolvers: [resolvers],

    formatError: (error) => error,

    context: ({ req, res }) => ({ req, res }),
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => {
    console.log(`app is listening to port ${PORT}`);
});
