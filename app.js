const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

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

  type User {
    _id: ID!
    email: String!
    password: String

  }

  input UserInput {
    email: String!
    password: String!
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
    createUser(userInput: UserInput!): User
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
      date: new Date().toISOString(),
      creator: "5e5b8273a7f7ef3f0c07c3a0"
    });

    let createdEvent;
    return event
      .save()
      .then(result => {
        createdEvent = { ...result._doc };
        return User.findById("5e5b8273a7f7ef3f0c07c3a0");
      })
      .then(user => {
        if (!user) {
          throw new Error("User not found already");
        }
        user.createdEvent.push(event);
        return user.save();
      })
      .then(result => {
        return createdEvent;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createUser: args => {
    return User.findOne({ email: args.userInput.email }).then(user => {
      if (user) {
        throw new Error("User exist already");
      }
      return bcrypt
        .hash(args.userInput.password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
          return user
            .save()
            .then(result => {
              return { ...result._doc, _id: result._id, password: null };
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          throw err;
        });
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
