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
`;

module.exports = { typeDef };
