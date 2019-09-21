const { gql } = require('apollo-server-express');

const typeDef = gql`

    type Crew {
        id: ID
        name: String
        oneLine: String
        leader: Member
        imagePath: String
        creationDate: String
        members: [Member]
    }

    extend type Mutation {
        createCrew(nickname: String, crew: CreateCrewInput): CreateCrewMutationResponse
    }
    
    "Input"
    input CreateCrewInput {
        name: String!
        oneLine: String!
        leader: String!
        creationDate: DateInput!
    }

    "Response"
    type CreateCrewMutationResponse implements Response {
        code: String!
        success: Boolean!
        message: String!
    }
`;

module.exports = { typeDef };
