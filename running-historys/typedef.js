const { gql } = require('apollo-server-express');

const typeDef = gql`

    type RunningHistory {
        id: ID
        name: String
        oneLine: String
        runningDate: Date
        leader: Member
        members: [Member]
        runningPoints: [Location]
    }

    extend type Query {
        runningHistorys: RunningsHistorysQueryResponse
    }

    "Response"
    type RunningsHistorysQueryResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        runningHistroys: [RunningHistory!]
    }
`;

module.exports = { typeDef };
