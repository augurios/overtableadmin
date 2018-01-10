var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var Scheme = new mongoose.Schema({
  emailid: String,
  userid:  String,
  time: String,
  token: String,
  created_at:  { type : Date, default: Date.now },
  updated_at:  { type : Date, default: Date.now },
  status: {type: String, default: "P"}, // P - pending, D - Done
});

mongoose.model('userAction', Scheme);

