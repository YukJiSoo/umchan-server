const { gql } = require('apollo-server-express');

const typeDef = gql`

    type User {
        id: ID!
        email: String
        password: String
        name: String
        nickName: String
        imagePath: String
        location: String
    }

    extend type Query {
        user(id: ID!): User
        users: [User]
    }

    type Mutation {
        register(user: RegisterUserInput): RegisterUserMutationResponse
        updateUser(user: UpdateUserInput): UpdateUserMutationResponse
    }
    
    "Input"
    input RegisterUserInput {
        email: String!
        password: String!
        name: String!
        nickName: String!
        imagePath: String!
        location: String!
    }

    input UpdateUserInput {
        token: String!
        id: ID!
        password: String
        nickName: String
        imagePath: String
        location: String
    }

    "Response"
    type RegisterUserMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        token: String!
        user: User!
    }

    type UpdateUserMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        user: User!
    }
`;

module.exports = { typeDef };
