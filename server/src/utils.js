const SQL = require('sequelize');

module.exports.paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize),
        )
    : results.slice(0, pageSize);
};

module.exports.createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new SQL('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './store.sqlite',
    operatorsAliases,
    logging: false,
  });

  const users = db.define('user', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: SQL.STRING,
    token: SQL.STRING,
  });

  const trips = db.define('trip', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    launchId: SQL.INTEGER,
    userId: SQL.INTEGER,
  });

  return { users, trips };
};


/*
Write your graph's resolvers
Learn how a graphQL fetches Data
Up until now, our graph API hasn't been very useful.
We can inspect our graph's schema.
It's time to leverage all of our hard work by calling our
data sources in our graph API's resolvers to possibly trigger business logic and/or to fetch and/or update data.
What is a resolver?
Resolvers provide the instructions for turning a graphQL operation
(a query, mutation, or subscription) into data. They either return the same type of data we\
specify in our schema or a promise for that data
Resolver functions accept four arguments:
fieldName: (parent, args, context, info) => data;
parent: An object that contains the result returned from the resolver
on the parent type
args: An object that contains the arguments passed to the field
context: An object shared by all resolvers in a graphQL operation.
We use the context to contain [er-request state such as authentication infomation and access our data source]
info: information about the execution state of the operation which should only be used in advanced case
This might sound confusing at first, but it will start to make more sense once
we dive into practical example. Let's get started!
Connecting resolvers to apollo server

*/



