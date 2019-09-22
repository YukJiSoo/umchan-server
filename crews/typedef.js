const { gql } = require('apollo-server-express');

const typeDef = gql`

    type Crew {
        id: ID
        name: String
        oneLine: String
        imagePath: String
        creationDate: Date
        leader: Member
        members: [Member]
    }

    extend type Query {
        crews(name: String): CrewsQueryResponse
    }

    extend type Mutation {
        createCrew(nickname: String, crew: CreateCrewInput): CreateCrewMutationResponse
    }
    
    "Input"
    input CreateCrewInput {
        name: String!
        oneLine: String!
        creationDate: DateInput!
    }

    "Response"
    type CrewsQueryResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
        crews: [Crew!]
    }


    type CreateCrewMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
