const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");

var app = express();
const events = [];
app.use(bodyParser.json());

var schema = buildSchema(`
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input EventInput{
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type Query {
    events: [Event!]!
  }

  type Mutation {
    createEvent(eventInput: EventInput!): Event
  }

`);

// The root provides a resolver function for each API endpoint
var root = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return { ...event._doc /* _id: event._doc._id.toString() */ };
        });
      })
      .catch(err => console.log(err));
  },
  createEvent: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date().toISOString()
    });
    return event
      .save()
      .then(result => {
        // console.log(result);
        return { ...result._doc };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
mongoose
  .connect("mongodb://localhost:27017/mernQL-eventBooking", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(4000);
    console.log(
      "Running a GraphQL API server at http://localhost:4000/graphql"
    );
  })
  .catch(err => console.log(err));
