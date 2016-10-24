const chalk = require('chalk');
const jwt = require('express-jwt');
const graphqlHTTP = require('express-graphql');
const userController = require('../controllers/user');
const schema = require('../schema/schema');

function routesConfig(app) {
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);

  app.use('/graphql', jwt({ secret: process.env.JWT_SECRET }), graphqlHTTP(request => ({
    schema,
    rootValue: { userid: request.user.userid },
    graphiql: true,
  })));

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
