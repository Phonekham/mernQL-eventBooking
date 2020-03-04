const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

var app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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
