const bCrypt = require("bcrypt");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = function(passport, user) {
  const User = user;
  const LocalStrategy = require("passport-local").Strategy;

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        session: false
      },

      (username, password, done) => {
        try {
          User.findOne({
            where: {
              username: username
            }
          }).then(user => {
            if (!user) {
              return done(null, false, { message: "bad username" });
            } else {
              bCrypt
                .compare(password, user.password)
                .then(response => {
                  if (response !== true) {
                    console.log("passwords do not match");
                    return done(null, false, {
                      message: "passwords do not match"
                    });
                  }
                  console.log("user found & authentificated");
                  return done(null, user);
                })
                .catch(err => {
                  console.log(err);
                });
            }
          });
        } catch (err) {
          done(err);
        }
      }
    )
  );

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret"
  };

  // JwtStrategy
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findOneById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
