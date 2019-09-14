const { gql } = require('apollo-server-express');

const typeDef = gql`

    "위도 / 경도"
    type Location {
        latitude: Float!
        longitude: Float!
    }

    type Date {
        year: Int
        month: Int
        date: Int
        hour: Int
        minute: Int
    }

    "Input"
    input LocationInput {
        latitude: Float!
        longitude: Float!
    }

    input DateInput {
        year: Int!
        month: Int!
        date: Int!
        hour: Int!
        minute: Int!
    }

    "Response"
    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }
    
    type Query
    type Mutation
`;

module.exports = { typeDef };
