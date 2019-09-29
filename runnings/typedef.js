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
        awaitMembers: [Member]
        runningPoints: [Location]
        district: String
    }

    extend type Query {
        runnings(name: String): RunningsQueryResponse
        running(input: RunningInput): RunningQueryResponse
    }

    extend type Mutation {
        createRunning(nickname: String, running: CreateRunningInput): CreateRunningMutationResponse
        applyRunning(input: ApplyRunningInput): ApplyRunningMutationResponse
        goOutRunning(input: GoOutInput): GoOutUserMutationResponse
    }
    
    "Input"
    input RunningInput {
        id: String!
        district: String!
    }

    input CreateRunningInput {
        name: String!
        oneLine: String!
        runningDate: DateInput!
        registerLimitDate: DateInput!
        runningPoints: [LocationInput]!
        district: String!
    }

    input ApplyRunningInput {
        id: String!
        district: String!
        user: MemberInput!
    }

    input GoOutInput {
        id: String!
        district: String!
    }

    "Response"
    type RunningQueryResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        running: Running!
        isApplied: Boolean
        isMember: Boolean
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

    type ApplyRunningMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type GoOutUserMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
