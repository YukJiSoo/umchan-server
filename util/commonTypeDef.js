const { gql } = require('apollo-server-express');

const typeDef = gql`

    "위도 / 경도"
    type Loaction {
        latitude: Float!
        longitude: Float!
    }

    "Response"
    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
