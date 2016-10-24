const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

const me = require('./queries/me.js');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'schema',
    fields: {
      me,
    },
  }),
});

module.exports = schema;
