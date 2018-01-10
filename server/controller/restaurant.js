/**
  * @author Akhil Gopan - akhil.gopan@techversantinfotech.com
  * @desc Authenticated Users Operation for the application
  * @model - User.js
**/

var common = require('../helpers/common.js');
var mail = require('../helpers/mail.js');
var keys = common.constants.keys()
var config = common.config
var response = { status  : null, success : null, data : null }; // status provide conditions of api request, success states the resultant status of api(boolean), data return data from api
var sess = {}; // common session constant
sess.user = null // set session constant user(int *usually id*) is set to null
const helpers = common.helpers;
const messages = common.constants.messages();
module.exports = function (app) {

//Models Required
var Restaurants = common.mongoose.model('User');

/**
 * Create all resturants
 */

app.get('/api/v1/restaurants', function (req, res) {
      sess = req.session;
      if(sess.role && sess.role == "admin"){
         Restaurants.find({active:1,role:'restaurant'}, { _id:1, firstname: 1, lastname:1},function(err, restaurants){
           if (err) { console.log(err); res.json(0); }
             return res.json(helpers.response(200,true,restaurants,0)) 
        });
      }
      else{
        return res.json(helpers.response(401,false,null,messages.forbiddenaccess)) 
         res.json(response)
      }
   
})

} // Employee module ENDS
