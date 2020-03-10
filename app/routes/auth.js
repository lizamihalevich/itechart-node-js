module.exports = function(app, passport) {
  app.get("/register", (req, res) => {
    res.send("register");
  });

  app.post("/register", passport.authenticate("local-signup"), (req, res) => {
    res.send(req.body);
    console.log(req.body);
  });

  app.post("/signin", passport.authenticate("local-signin"), (req, res) => {
    res.send(req.body);
    console.log(req.body);
  });
};
