const { gql } = require('apollo-server-express');

const typeDef = gql`

    type Crew {
        id: ID
        name: String
        oneLine: String
        district: String
        creationDate: Date
        leader: Member
        members: [Member]
        awaitMembers: [Member]
    }

    extend type Query {
        crews(name: String): CrewsQueryResponse
        crew(input: CrewInput): CrewQueryResponse
    }

    extend type Mutation {
        createCrew(input: CreateCrewInput): CreateCrewMutationResponse
        applyCrew(input: ApplyCrewInput): ApplyCrewMutationResponse
        goOutCrew(input: GoOutCrewInput): GoOutCrewMutationResponse
        disassembleCrew(input: DisassembleCrewInput): DisassembleCrewMutationResponse
        acceptCrewMember(input: AcceptCrewMemberInput): AcceptCrewMemeberMutationResponse
        rejectCrewMember(input: RejectCrewMemberInput): RejectCrewMemeberMutationResponse
        exceptCrewMember(input: ExceptCrewMemberInput): ExceptCrewMemeberMutationResponse
    }
    
    "Input"
    input CrewInput {
        id: String!
        district: String!
    }

    input CreateCrewInput {
        nickname: String!
        name: String!
        oneLine: String!
        district: String!
        creationDate: DateInput!
    }

    input ApplyCrewInput {
        id: String!
        district: String!
        user: MemberInput!
    }

    input GoOutCrewInput {
        id: String!
        district: String!
    }

    input DisassembleCrewInput {
        id: String!
        district: String!
    }

    input AcceptCrewMemberInput {
        id: String!
        district: String!
        memberID: String!
    }

    input CheckCrewMemberInput {
        id: String!
        district: String!
        memberID: String!
    }

    input RejectCrewMemberInput {
        id: String!
        district: String!
        memberID: String!
    }

    input ExceptCrewMemberInput {
        id: String!
        district: String!
        memberID: String!
    }
    "Response"
    type CrewsQueryResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        crews: [Crew!]
    }

    type CrewQueryResponse  implements Response {
        code: String!
        success: Boolean!
        message: String!
        crew: Crew!
        isApplied: Boolean
        isMember: Boolean
    }

    type CreateCrewMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type ApplyCrewMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type GoOutCrewMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type DisassembleCrewMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type AcceptCrewMemeberMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type CheckCrewMemeberMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type RejectCrewMemeberMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }

    type ExceptCrewMemeberMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
