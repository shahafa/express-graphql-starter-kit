const compression = require('compression');
const logger = require('morgan');
const bodyParser = require('body-parser');
const lusca = require('lusca');
const expressValidator = require('express-validator');
const chalk = require('chalk');

function expressConfig(app) {
  // Sets the app port
  app.set('port', process.env.PORT || 3000);

  // Compress response bodies
  app.use(compression());

  // HTTP request logger
  app.use(logger('dev'));

  // An express.js middleware for node-validator
  app.use(expressValidator());

  // Parses json, A new body object containing the parsed data is populated on
  // the request object after the middleware
  app.use(bodyParser.json());

  // Parses urlencoded bodies, A new body object containing the parsed data is
  // populated on the request object after the middleware (i.e. req.body). This
  // object will contain key-value pairs, where the value can be a string or
  // array (when extended is false), or any type (when extended is true).
  app.use(bodyParser.urlencoded({ extended: true }));

  // Enables X-FRAME-OPTIONS headers to help prevent Clickjacking
  app.use(lusca.xframe('SAMEORIGIN'));

  // Enables X-XSS-Protection headers to help prevent cross site scripting (XSS)
  // attacks in older IE browsers (IE8)
  app.use(lusca.xssProtection(true));

  // Indicates the app is behind a front-facing proxy,
  // and to use the X-Forwarded-* headers to determine the connection and the
  // IP address of the client.
  app.set('trust proxy', 'loopback');

  // X-Powered-By header has no functional value.
  // Keeping it makes it easier for an attacker to build the site's profile
  // It can be removed safely
  app.disable('x-powered-by');

  // consider at later stage
  // app.use(flash());
  // app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

  console.log('%s Express configured successfully', chalk.green('✓'));
}

module.exports = expressConfig;
