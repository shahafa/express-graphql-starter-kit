const User = require('../../models/User');
const UserType = require('../types/UserType.js');

const me = {
  type: UserType,
  resolve: (post, args, context, { rootValue }) => User.getById(rootValue.userid),
};

module.exports = me;
