const ERROR_VALIDATION_FAILED = {
  code: 1,
  message: 'Validation Failed',
};

const ERROR_USER_ALLREADY_EXISTS = {
  code: 2,
  message: 'User allready exists',
};

const ERROR_INVALID_TOKEN = {
  code: 3,
  message: 'Invalid Token',
};

const ERROR_INVALID_USERNAME_OR_PASSWORD = {
  code: 4,
  message: 'Invalid username or password',
};

const ERROR_SOMTHING_BAD_HAPPEND = {
  code: 5,
  message: 'Something bad happened :(',
};

const ERROR_USER_NOT_FOUND = {
  code: 6,
  message: 'User not found',
};

module.exports = {
  ERROR_VALIDATION_FAILED,
  ERROR_USER_ALLREADY_EXISTS,
  ERROR_INVALID_TOKEN,
  ERROR_INVALID_USERNAME_OR_PASSWORD,
  ERROR_SOMTHING_BAD_HAPPEND,
  ERROR_USER_NOT_FOUND,
};
