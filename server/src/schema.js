const { gql } = require('apollo-server');

//The schema will go inside gpl function (between the backticks). The language we'll use to write the schema definition language (sdl)
//Most of the definitions in a GraphQL schema are object types.
//Each object type you define should represent an object that an application client might need to interact with.
//The Launch object type has a collection of fields, and each field has a type of its own. A field's type can be either an object type or a scalar type.
//A scalar type is a primitive (like ID, String, Boolean, or Int)
//An exclamation point ! after a declared field's type means "this field's value can never be null"

const typeDefs = gql`
type Query {
    launches(
        pageSize: Int
        after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
}

type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
}

type Rocket {
    id: ID!
    name: String
    type: String
}

type User {
    id: ID!
    email: String!
    trips: [Launch]!
}

type Mission {
    name: String
    missionPatch(size: PatchSize, size: PatchSize): String
}

enum PatchSize {
    SMALL
    LARGE
}

type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String # login token
}

type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
}

type LaunchConnection { # add this below the Query type as an additional type.
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
}
`;

module.exports = typeDefs;


/*

type Query {
  launches( # replace the current launches query with this one.
    pageSize: Int
    after: String
  ): LaunchConnection!
  launch(id: ID!): Launch
  me: User
}

type LaunchConnection { # add this below the Query type as an additional type.
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}
...

type Query {
  launches( # replace the current launches query with this one.
    """
    The number of results to show. Must be >= 1. Default = 20
    """
    pageSize: Int
    """
    If you add a cursor here, it will only return results _after_ this cursor
    """
    after: String
  ): LaunchConnection!
  launch(id: ID!): Launch
  me: User
}

"""
Simple wrapper around our list of launches that contains a cursor to the
last item in the list. Pass this cursor to the launches query to fetch results
after these.
"""
type LaunchConnection { # add this below the Query type as an additional type.
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}
...


The Mutation type
Queries enable clients to fetch data, but not to modify data.
To enable clients to modify data, our schema needs to define some mutations.

The Mutation type is special type that's similar in 

2. Hook up your data sources
Connect REST and SQL data to you graph
Now that we've constructed our schema, we need to hook up our data sources to our GraphQL API.

The Apollo RestDataSource also sets up an in-memory catch that catches responses
from our REST resources with no additional setup.

*/