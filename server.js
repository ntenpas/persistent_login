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
var Account; // schema
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  Account = new mongoose.Schema({
    username: String,
    password: String
  });
  User = mongoose.model('User', Account);

  Account.plugin(passportLocalMongoose);
  Account.validPassword = function(username, password) {
    User.findOne({username: username, password: password}, function(err, user) {
      if (user)
        return true;
      return false;
    });
  }
  Account.authenticate = function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (err)
        return done(err);
      if (!user)
        return done(null, false, {message: 'Incorrect Username'});
      if (!user.validPassword(username, password)) {
        return done(null, false, {message: 'Incorrect Password'});
      return done(null, user);
      }
    });
  }
  passport.use(new LocalStrategy(Account.authenticate()));
  passport.serializeUser(Account.serializeUser());
  passport.deserializeUser(Account.deserializeUser());
});




app.post('/signup', data.array(), function(req, res) {
  // get user information
  // check if user is already in database
  // add user to database if not already in it
  var username = req.body.username;
  var password = req.body.password;

  Account.register(new Account({username: username}), password,
    function(err, account) {
      if (err)
        res.redirect('/error');
        //return res.render('signup', {account: account});
      passport.authenticate('local')(req, res, function() {
        res.redirect('/profile')
      });
    });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
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
