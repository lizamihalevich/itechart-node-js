const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const models = require("./app/models");
const env = require("dotenv").config();
const port = process.env.PORT || 3000;
const registerUserRoute = require("./app/routes/registerUser");
const loginUserRoute = require("./app/routes/loginUser");

//bodyParser
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport
app.use(passport.initialize());

// Routes
registerUserRoute(app, passport);
loginUserRoute(app, passport);

// load passport strategies
require("./app/config/passport/passport")(passport);

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
