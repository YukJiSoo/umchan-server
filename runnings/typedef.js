const { gql } = require('apollo-server-express');

const typeDef = gql`

    type Running {
        id: ID
        name: String
        oneLine: String
        runningDate: Date
        registerLimitDate: Date
        leader: Member
        members: [Member]
        runningPoints: [Location]
    }

    extend type Query {
        runnings(name: String): RunningsQueryResponse
        running(id: ID): RunningQueryResponse
    }

    extend type Mutation {
        createRunning(nickname: String, running: CreateRunningInput): CreateRunningMutationResponse
    }
    
    "Input"
    input CreateRunningInput {
        name: String!
        oneLine: String!
        runningDate: DateInput!
        registerLimitDate: DateInput!
        runningPoints: [LocationInput]!
    }

    "Response"
    type RunningQueryResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        running: Running!
    }

    type RunningsQueryResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        runnings: [Running!]
    }

    type CreateRunningMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
