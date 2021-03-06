const { gql } = require('apollo-server-express');

const typeDef = gql`

    type Account {
        id: ID!
        email: String!
        password: String!
        salt: String!
    }

    extend type Mutation {
        login(account: LoginInput!): LoginMutationResponse
    }

    "Input"
    input LoginInput {
        email: String!
        password: String!
    }
    
    "Response"
    type LoginMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        token: String
        user: User
    }
`;

module.exports = { typeDef };
