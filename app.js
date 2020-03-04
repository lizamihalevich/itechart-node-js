const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const exphbs = require("express-handlebars");
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

//For Handlebars
app.set("views", "./app/views");
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: false,
    layoutsDir: "views/layouts/"
  })
);
app.set("view engine", ".hbs");

app.get("/", (req, res) => res.send("Hello World!"));

// Models
const models = require("./app/models");

// Routes
const authRoute = require("./app/routes/auth.js")(app, passport);

// load passport strategies
require("./config/passport/passport.js")(passport, models.user);

//Sync Database
models.sequelize
  .sync()
  .then(function() {
    console.log("Nice! Database looks fine");
  })
  .catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
  });

const data = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

app.get("/api/data", (req, res) => res.send(data));

app.get("/api/data/:id", (req, res) => {
  const course = data.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("was not found");
  }
  res.send(course);
});

app.post("/", function(req, res) {
  res.send("post request!");
});

app.post("/api/data", (req, res) => {
  const course = {
    id: data.length + 1,
    name: req.body.name
  };
  data.push(course);
  res.send(course);
  console.log(req.body);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
