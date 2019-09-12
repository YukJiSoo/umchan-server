const { gql } = require('apollo-server-express');

const typeDef = gql`

    "위도 / 경도"
    type Location {
        latitude: Float!
        longitude: Float!
    }

    input LocationInput {
        latitude: Float!
        longitude: Float!
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
