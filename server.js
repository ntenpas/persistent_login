'use strict';
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const data = multer();

app.use(express.static('public'));

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
  User = mongoose.model('User', userSchema);
});

app.use(session({
  secret: 'owl',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({url: 'mongodb://localhost:27017/persistent_login'})
}));

var auth = function(req, res, next) {
  if (req.session && req.session.username == 'nolan')
    return next();
  else {
    console.log(req.session);
    return res.sendStatus(401);
  }
}

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
        else
          return console.log('user saved successfully');
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
    if (err)
      console.log('error in query');
    else if (foundUser != null) {
      req.session.username = username;
      req.session.password = password;
      console.log('login success!');
      console.log(req.session);
    }
    else
      console.log('no user exists in database.');
  });

  res.send('got it');
});

app.get('/profile', data.array(), function(req, res) {
  console.log(req.session);
  res.send('profile');
});

app.listen(8080, function() {
  console.log('listening on port 8080');
});
