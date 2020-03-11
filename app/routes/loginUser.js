const User = require("../models/user");
const jwtSecret = require("../config/jwtConfig");

module.exports = function(app, passport) {
  app.post("/signin", (req, res, next) => {
    passport.authenticate("local-signin", (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        next();
      } else {
        req.logIn(user, err => {
          if (err) {
            console.log(err);
          }
          User.findOne({
            where: {
              username: user.username
            }
          })
            .then(user => {
              const token = jwt.sign({ id: user.username }, jwtSecret.secret);
              res.status(200).send({
                auth: true,
                token: token,
                message: "user found & logged in"
              });
            })
            .catch(err => console.log(err));
        });
      }
    })(req, res, next);
  });
};
