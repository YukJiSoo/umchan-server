const { gql } = require('apollo-server-express');

const typeDef = gql`

    type Running {
        id: ID
        name: String
        oneLine: String
        runningDate: Date
        registerLimitDate: Date
        runningPoints: [Location]
    }

    extend type Query {
        runnings: RunningsQueryResponse
    }

    extend type Mutation {
        createRunning(running: CreateRunningInput): CreateRunningMutationResponse
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
    type RunningsQueryResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        runnings: [Running]
    }

    type CreateRunningMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
