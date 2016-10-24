require('dotenv').config({ path: '.env.test' });

const database = require('../config/database');
const chalk = require('chalk');
const User = require('../models/User');
const { ERROR_USER_ALLREADY_EXISTS,
        ERROR_INVALID_USERNAME_OR_PASSWORD,
        ERROR_USER_NOT_FOUND } = require('../lib/errors.js');

beforeAll((done) => {
  database.connect().then(() => done())
  .catch((error) => {
    console.log('%s Database connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    done.fail(error);
  });
});

it('should create a new user', () =>
  User.add('testuser1', 'testpassword1')
  .then((result) => {
    expect(result).toEqual(true);
  })
);

it('should not create user if username allready exists', () =>
  User.add('testuser1', 'testpassword1')
  .catch(error => expect(error).toEqual(ERROR_USER_ALLREADY_EXISTS))
);

it('should generate a token if username and password are valid', () =>
  User.getToken('testuser1', 'testpassword1')
  .then((result) => {
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
  })
);

it('should not generate token if username doesn\'t exists', () =>
  User.getToken('testuser2', 'testpassword2')
  .catch(error => expect(error).toEqual(ERROR_USER_NOT_FOUND))
);

it('should not generate token if password doesn\'t match username', () =>
  User.getToken('testuser1', 'testpassword2')
  .catch(error => expect(error).toEqual(ERROR_INVALID_USERNAME_OR_PASSWORD))
);

it('should delete user', () =>
  User.delete('testuser1')
  .then((result) => {
    expect(result).toEqual(true);
  })
);

it('should not delete user if user doesn\'t exists', () =>
  User.delete('testuser1')
  .catch(error => expect(error).toEqual(ERROR_USER_NOT_FOUND))
);

afterAll(() => {
  database.disconnect();
});
