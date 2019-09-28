const { gql } = require('apollo-server-express');

const typeDef = gql`

    type User {
        id: ID!
        name: String!
        nickname: String!
        district: String!
        runnings: [String]
        crews: [String]
    }

    extend type Query {
        user: UserQueryResponse
    }

    extend type Mutation {
        register(user: RegisterUserInput): RegisterUserMutationResponse
    }
    
    "Input"
    input RegisterUserInput {
        email: String!
        password: String!
        name: String!
        nickname: String!
        district: String!
    }

    "Response"
    type UserQueryResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        user: User
    }

    type RegisterUserMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        token: String
    }
`;

module.exports = { typeDef };
