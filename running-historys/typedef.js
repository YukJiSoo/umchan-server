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

    extend type Mutation {
        registerRunningsHistory(runningHistory: RunningHistoryInput): RegisterRunningsHistoryMutationResponse
    }

    "Input"
    input RunningHistoryInput {
        id: ID!
        name: String!
        oneLine: String!
        runningDate: DateInput!
        leader: MemberInput!
        members: [MemberInput]!
        runningPoints: [LocationInput]!
    }

    "Response"
    type RunningsHistorysQueryResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        runningHistroys: [RunningHistory!]
    }

    type RegisterRunningsHistoryMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
