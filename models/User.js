/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ERROR_USER_ALLREADY_EXISTS,
        ERROR_USER_NOT_FOUND,
        ERROR_SOMTHING_BAD_HAPPEND,
        ERROR_INVALID_USERNAME_OR_PASSWORD,
        ERROR_VALIDATION_FAILED } = require('../lib/errors.js');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
}, { timestamps: true });


UserSchema.pre('save', function(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) next();

  // hash the password using with salt
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) {
      next(err);
    }

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    const pass = this.password;
    bcrypt.compare(candidatePassword, pass, (error, isMatch) => {
      if (error) {
        console.log(`Error: ${error}`);
        reject(error);
      }

      resolve(isMatch);
    });
  });
};

UserSchema.statics.getByUserName = function(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      reject(ERROR_VALIDATION_FAILED);
      return;
    }

    this.findOne({ username }).exec()
    .then((user) => {
      // if user doesn't exists in DB
      if (!user) {
        reject(ERROR_USER_NOT_FOUND);
        return;
      }

      resolve(user);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
};

UserSchema.statics.getById = function(userId) {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject(ERROR_VALIDATION_FAILED);
      return;
    }

    this.findOne({ _id: userId }).exec()
    .then((user) => {
      // if user doesn't exists in DB
      if (!user) {
        reject(ERROR_USER_NOT_FOUND);
        return;
      }

      resolve(user);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
};

UserSchema.statics.getAll = function() {
  return new Promise((resolve, reject) => {
    this.find({}).exec()
    .then((users) => {
      resolve(users);
    }).catch((error) => {
      console.log(`Error: ${error}`);
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
};

UserSchema.statics.add = function(username, password) {
  return new Promise((resolve, reject) => {
    if (!username || !password) {
      reject(ERROR_VALIDATION_FAILED);
      return;
    }

    // Check if user allready exists
    this.findOne({ username }).exec()
    .then((user) => {
      if (user !== null) {
        reject(ERROR_USER_ALLREADY_EXISTS);
        return;
      }

      const newUser = new this({
        username,
        password,
      });

      newUser.save((error) => {
        if (error) throw error;

        resolve(true);
      });
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
};

UserSchema.statics.delete = function(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      reject(ERROR_VALIDATION_FAILED);
      return;
    }

    // Check if user allready exists
    this.findOne({ username }).exec()
    .then((user) => {
      if (user === null) {
        reject(ERROR_USER_NOT_FOUND);
        return;
      }

      user.remove((error) => {
        if (error) throw error;

        resolve(true);
      });
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
};

UserSchema.statics.getToken = function(username, password) {
  return new Promise((resolve, reject) => {
    if (!username || !password) {
      reject(ERROR_VALIDATION_FAILED);
      return;
    }

    this.getByUserName(username).then((user) => {
      user.comparePassword(password).then((passwordMatch) => {
        if (!passwordMatch) {
          reject(ERROR_INVALID_USERNAME_OR_PASSWORD);
          return;
        }

        const token = jwt.sign({
          userid: user._id, // eslint-disable-line
          user: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        resolve(token);
      });
    })
    .catch((error) => {
      reject(error);
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
