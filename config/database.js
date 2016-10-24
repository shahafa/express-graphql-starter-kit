const mongoose = require('mongoose');

exports.connect = () => {
  const connectPromise = new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI);

    mongoose.connection.on('open', () => {
      resolve(true);
    });

    mongoose.connection.on('error', (error) => {
      reject(error);
    });
  });

  return connectPromise;
};

exports.disconnect = () => {
  mongoose.connection.close();
};
