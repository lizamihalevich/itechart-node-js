const User = require("../models/user");

module.exports = function(app) {
  app.post("/register", (req, res) => {
    const password = req.body.password;

    const generateHash = function(password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(user) {
      if (user) {
        return done(null, false, {
          message: "That email is already taken"
        });
      } else {
        const userPassword = generateHash(password);

        const data = {
          email: email,
          password: userPassword,
          firstname: req.body.name,
          lastname: req.body.lastname,
          username: req.body.username,
          birthdate: req.body.birthdate,
          about: req.body.about
        };

        User.create(data).then(function(newUser, created) {
          if (!newUser) {
            return done(null, false);
          }

          if (newUser) {
            return done(null, newUser);
          }
        });
      }
    });

    res.send(req.body);
    console.log(req.body);
  });
};
