const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

var schema = buildSchema(`
  type Query {
    events: [String!]!
  }

   type Mutation {
    createEvent(name: String): String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  events: () => {
    return ["React", "Node", "Graphql"];
  },
  createEvent: args => {
    const eventName = args.name;
    return eventName;
  }
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
