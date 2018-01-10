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
var User = common.mongoose.model('User');


  
app.post('/api/login', function (req, res, next) {

      if(!req.body.email || !req.body.password){
      	return res.status(400).json(helpers.response(400,false,0,messages.noSufficientData))
      }
      else{

      	var username = req.body.email
      	var password = req.body.password
        
      	User.findOne({ email: username,active : 1 }, function (err, user) {
	      if (err) { console.log("Login Error");console.log(err); }//return done(err); }
	      if (!user) {
	         return res.json(helpers.response(404,false,0,messages.nouser))      
	      }
	      else{
	      	if(user.salt && user.password){
	      		var salt = user.salt
      			var hash = common.crypto.pbkdf2Sync(password, salt, 1000, 64,'sha512').toString('hex');

      			if(hash === user.password){
      				sess = req.session;
			        sess.userid = user._id;
			        sess.name = user.firstname;
			        sess.username = user.username;
			        sess.email = user.email;
			        var tokenval = common.jwt.sign(user.email, keys.sessionkey);
			        sess.token = tokenval;
			        sess.role = user.role;
			        return res.json(helpers.response(200,true,sess,messages.loginsuccessful));
      			}
      			else{
                 return res.json(helpers.response(401,false,sess,messages.invalidcredentials));
      				
      			}
	      	}
	      	
	      }
     
	    });
      }
  
});
  
app.get('/auth/get_session', function (req, res) {

   var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   req.connection.socket.remoteAddress;

      sess = req.session;
      if (sess.userid != null) {
          res.json(sess);
      }
      else{
           res.json(0);
      }

});
app.get('/auth/getUserData', function (req, res) {
  console.log("Session data retrived")
      sess = req.session;
      if (sess.userid != null) {
          res.json(helpers.response(200,true,sess,0)) 
      }
      else{
          res.json(helpers.response(400,false,null,0)) 
      }

});

app.post('/api/logout', function (req, res) {

      
      var sess;
      sess = req.session;
      
      req.session.destroy(function () {
          // res.send('Session deleted');

          sess.user = null;
          sess.name = null
          sess.email = null;
          sess.token = null
          sess.club = null
          sess.sign = {}; 
          sess.roles = null

          var response = { status  : 202, success : true, data :  sess};
          return res.json(helpers.response(401,false,sess,messages.loggedout))      
          
      });

});

//Check Existence email for user
app.post('/auth/email', function (req, res) {
var email = req.body.email
var subscription = req.body.subscription ? req.body.subscription : 'null';
if(subscription == 'null'){
  //When Add
    User.find({ 'email':email }, function(err, user) {

        if (err) {
          return res.json(helpers.response(400,false,0,messages.actionnotcompleted))   
        }

        //if user found.
        if (user.length > 0) {
           return res.json(helpers.response(400,false,0,messages.useralreadyexists))   
        }
        else{
           return res.json(helpers.response(200,true,0,messages.done))   
        }
    });
}
else{
  //When Edit
     User.find({"_id" : {"$ne" : [subscription]},"email":email}, function(err, user) {
        if (err) {
          return res.json(helpers.response(400,false,0,messages.actionnotcompleted))   
        }

        //if user found.
        if (user.length > 0) {
           return res.json(helpers.response(400,false,0,messages.useralreadyexists))   
        }
        else{
           return res.json(helpers.response(200,true,0,messages.done))   
        }
    });
}

   
});
} // user module ENDS
