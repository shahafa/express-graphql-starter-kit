const { Base64 } = require('js-base64');
const User = require('../models/User');
const { ERROR_VALIDATION_FAILED } = require('../lib/errors.js');

function login(req, res) {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req.checkBody('password', 'Password needs to be in Base64 format').isBase64();

  const errors = req.validationErrors();
  if (errors) {
    const error = ERROR_VALIDATION_FAILED;
    error.errors = errors;
    return res.json(error);
  }

  const username = req.body.user;
  const password = Base64.decode(req.body.password);

  User.getToken(username, password)
  .then(token => res.json({
    message: 'Login successful',
    token,
  }))
  .catch(error => res.json(error));
}

function signup(req, res) {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req.checkBody('password', 'Password needs to be in Base64 format').isBase64();

  const errors = req.validationErrors();
  if (errors) {
    const error = ERROR_VALIDATION_FAILED;
    error.errors = errors;
    return res.json(error);
  }

  const username = req.body.user;
  const password = Base64.decode(req.body.password);

  User.add(username, password)
  .then(() => res.json({ message: `User ${req.body.user} added successfully` }))
  .catch(error => res.json(error));
}

module.exports = {
  login,
  signup,
};
