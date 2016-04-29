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

app.listen(8080, function() {
  console.log('listening on port 8080');
});