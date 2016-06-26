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
mongoose.connect('mongodb://localhost:27017/persistent_login');

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




app.post('/signup', data.array(), function(req, res) {
  // get user information
  // check if user is already in database
  // add user to database if not already in it
  var username = req.body.username;
  var password = req.body.password;

  User.register(new User({username: username}), password,
    function(err) {
      if (err)
        res.redirect('/error');
      console.log('user registered');
      res.redirect('/profile');
    });
});

app.post('/login', data.array(), passport.authenticate('local'), function(req, res) {
  res.redirect('/profile');
});

app.get('/profile', data.array(), function(req, res) {
  console.log(req.session);
  res.send('profile');
});

app.get('/error', function(req, res) {
  res.send('error');
});

app.listen(8080, function() {
  console.log('listening on port 8080');
});
