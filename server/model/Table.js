var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var TableSchema = new mongoose.Schema({
    number: { type: Number },
    name: { type: String },
    type: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: String,
    updated_by: String,
    style:String,
    rotation:String,
    size: Number,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    active: { type: Number, default: 1 },
    syncflag: { type: Number, default: 0 },
    roomid: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

mongoose.model('Table', TableSchema);

