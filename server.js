'use strict';
var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var app = express();
var data = multer();

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
    if (err) {
      console.log('error in query');
    }
    else if (foundUser != null) {
      // continue here with session data!
    }
    else
      console.log('user found in database, no save');
  });

  res.send('got it');
});

app.listen(8080, function() {
  console.log('listening on port 8080');
});
