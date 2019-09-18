const { gql } = require('apollo-server-express');

const typeDef = gql`

    type User {
        id: ID!
        name: String!
        nickname: String!
        imagePath: String!
        location: Location!
        runnings: [String]
    }

    extend type Query {
        user: String
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
        location: LocationInput!
    }

    "Response"
    type RegisterUserMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        token: String
    }
`;

module.exports = { typeDef };
