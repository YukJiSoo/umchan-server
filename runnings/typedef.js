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
        acceptRunningMember(input: AcceptRunningMemberInput): AcceptRunningMemeberMutationResponse
        checkRunningMember(input: CheckRunningMemberInput): CheckRunningMemeberMutationResponse
        rejectRunningMember(input: RejectRunningMemberInput): RejectRunningMemeberMutationResponse
        exceptRunningMember(input: ExceptRunningMemberInput): ExceptRunningMemeberMutationResponse
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

    input AcceptRunningMemberInput {
        id: String!
        district: String!
        memberID: String!
    }

    input CheckRunningMemberInput {
        id: String!
        district: String!
        memberID: String!
    }

    input RejectRunningMemberInput {
        id: String!
        district: String!
        memberID: String!
    }

    input ExceptRunningMemberInput {
        id: String!
        district: String!
        memberID: String!
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

    type AcceptRunningMemeberMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type CheckRunningMemeberMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type RejectRunningMemeberMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type ExceptRunningMemeberMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
