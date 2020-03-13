const models = require("../models/user");
const User = models.user;

exports.createUser = user => {
  return User.create(user);
};

exports.findUser = ({ username }) => {
  return User.findOne({
    where: {
      username: username
    }
  });
};
