const { gql } = require('apollo-server-express');

const typeDef = gql`

    type Account {
        id: ID!
        email: String!
        password: String!
    }

    extend type Query {
        login(account: LoginInput!): LoginMutationResponse
    }

    "Input"
    input LoginInput {
        email: String!
        password: String!
    }
    
    "Response"
    type LoginMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        token: String!
        user: User!
    }
`;

module.exports = { typeDef };
