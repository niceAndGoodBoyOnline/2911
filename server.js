var cors = require('cors')

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy
let options       = { useNewUrlParser: true , useUnifiedTopology: true};
var app = express();
app.use(cors());
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Connect to the database before starting the application server.
mongoose.connect(process.env.MONGODB_URI, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(mongoose.connection)
  // Initialize the app.
<<<<<<< HEAD
  var server = app.listen(process.env.PORT, function () {
=======
  var server = app.listen(process.env.PORT || 3000, function () {
>>>>>>> master
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});
mongoose.set('useCreateIndex', true);

app.use(express.urlencoded({ extended: true }));;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,    
    cookie: { maxAge:60000 },
    store: new (require('express-sessions'))({
      storage: 'mongodb',
    })
}));

app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

require('./router')(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});