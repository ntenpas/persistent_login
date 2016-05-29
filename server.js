'use strict';
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const app = express();
const data = multer();

app.use(express.static('public'));
app.use(session({
  secret: 'owl',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/persistent_login');

// connect to db and build schema
var db = mongoose.connection;
var User; // model
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  var userSchema = new mongoose.Schema({
    username: String,
    password: String
  });
  userSchema.plugin(passportLocalMongoose);
  User = mongoose.model('User', userSchema);
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
});

app.get('/profile', function(req, res) {
  console.log(req.user);
});

app.post('/signup', data.array(), function(req, res) {
  // get user information
  // check if user is already in database
  // add user to database if not already in it
  var username = req.body.username;
  var password = req.body.password;
  
  var query = User.findOne({username: username, password: password});
  query.exec(function(err, foundUser) {
    if (err) {
      console.log('error in query');
    }
    else if (foundUser === null) {
      var user = new User({
        username: username,
        password: password});
      user.save(function(err, savedUser) {
        if (err)
          return console.error(err);
        else {
          passport.authenticate('local')(req, res, function() {
            res.redirect('/profile');
          });
          return console.log('user saved successfully');
        }
      });
    }
    else
      console.log('user found in database, no save');
  });

  res.send('got it');
});

app.post('/login', data.array(), function(req, res) {
  // get user information
  // check if user is in database
  // login if in database
  var username = req.body.username;
  var password = req.body.password;
  
  var query = User.findOne({username: username, password: password});
  query.exec(function(err, foundUser) {
    if (err) {
      console.log('error in query');
    }
    else if (foundUser != null) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/profile');
      });
    }
    else
      console.log('no user exists in database.');
  });

  res.send('got it');
});

app.listen(8080, function() {
  console.log('listening on port 8080');
});
