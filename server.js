'use strict';
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var connectEnsureLogin = require('connect-ensure-login');

var app = express();

app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/persistent_login');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'owl',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// connect to db and build schema
var db = mongoose.connection;
var User; // model
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  User = require('./user');
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
});

app.post('/signup', function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password,
    function(err) {
      if (err)
        res.redirect('/error');
      console.log('user registered');
      res.redirect('/profile');
    });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/profile');
});

app.get('/profile', function(req, res) {
  console.log(req);
  if (req.user)
    res.send(req.user.username);
  else {
    console.log(req.session);
    res.send('no user logged in');
  }
});

app.get('/error', function(req, res) {
  res.send('error');
});

app.listen(8080, function() {
  console.log('listening on port 8080');
});
