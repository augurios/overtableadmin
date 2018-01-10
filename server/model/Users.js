var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var UserSchema = new mongoose.Schema({
  firstname: {type: String},
  lastname: {type: String},
  email: {type: String, lowercase: true, unique: true},
  username: {type: String, lowercase: true, unique: true},
  phone: String,
  password: String,
  salt: String,
  role:  String,
  image: String,
  token: String,
  created_at:  { type : Date, default: Date.now },
  updated_at:  { type : Date, default: Date.now },
  created_by: String,
  updated_by: String,
  active: {type: Number, default: 1},
  restauranteObj: {
	  rName:  {type: String, default: ''},
	  lName:  {type: String, default: ''},
	  cJuridica:  {type: String, default: ''},
	  telefono:  {type: String, default: ''},
	  direccion:  {type: String, default: ''},
	  wifi:  {type: String, default: ''},
	  disclaimer:  {type: String, default: ''},
	  costTarget:  {type: Number, default: 0},
	  serviceTax:  {type: Number, default: 0},
	  SaleTax:  {type: Number, default: 0}
  }
});

mongoose.model('User', UserSchema);

