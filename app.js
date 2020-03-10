const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const port = process.env.PORT || 3000;

//bodyParser
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.send("Hello World!"));

// Models
const models = require("./app/models");

// Routes
const authRoute = require("./app/routes/auth.js")(app, passport);

// load passport strategies
require("./app/config/passport/passport")(passport, models.user);

//Sync Databases
(async () => {
  try {
    await models.sequelize.sync();
    console.log("Nice! Database looks fine");
  } catch {
    console.log(err, "Something went wrong with the Database Update!");
  }
})();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
