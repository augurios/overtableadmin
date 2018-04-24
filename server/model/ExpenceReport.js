var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var ExpenceReportSchema = new mongoose.Schema({
    editby: { type: String },
    editamount:{type: Number},
  created_at:  { type : Date, default: Date.now },
  updated_at:  { type : Date, default: Date.now },
  created_by: {type: String, default: ''},
  updated_by: {type: String, default: ''},
  active: { type: Number, default: 1 },
  observation: { type: String },
  shift: { type: String },
  restaurant: { type: String },
  clientId: { type: String },
});

mongoose.model('ExpenceReport', ExpenceReportSchema);

