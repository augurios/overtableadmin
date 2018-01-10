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
var UserAction = common.mongoose.model('userAction');


/**
 * Get All user
 * @return {json}      [user with active 1]
 */
app.get('/api/v1/users', function (req, res) {
  var sess = req.session;
  if(sess.role && sess.role == "admin"){
     User.find({active:1}, { firstname: 1,lastname:1, email:1,role:1,phone:1,restauranteObj:1 },function(err, users){
       if (err) { console.log(err); res.json(0); }
         return res.json(helpers.response(200,true,users,0)) 
    });
  }
  else{
     return res.json(helpers.response(401,false,0,messages.unauthorized)) 
  }
 
});

app.post('/api/v1/create/user', function (req, res) {
var sess = req.session;
    
     var data = new User();
     data.firstname = req.body.fname
     data.lastname =  req.body.lname
     data.role = req.body.role
     data.phone = req.body.phone
     var username = helpers.username(req.body.fname+' '+req.body.lname)
     data.username = username
     data.email =   req.body.email
     var token =   helpers.tokenizer(req.body.email)
     data.token =   token
     data.created_by =   sess.userid
     data.updated_by =   sess.userid
     var password = helpers.generateRandomPassword()
     
     var hexSalt = helpers.saltGen();
     var hash = common.crypto.pbkdf2Sync(password, hexSalt, 1000, 64,'sha512').toString('hex');
     data.password = hash
     data.salt = hexSalt
     data.restauranteObj.rName = req.body.restauranteObj.rName
	 data.restauranteObj.lName = req.body.restauranteObj.lName
	 data.restauranteObj.cJuridica = req.body.restauranteObj.cJuridica
	 data.restauranteObj.telefono = req.body.restauranteObj.telefono
	 data.restauranteObj.direccion = req.body.restauranteObj.direccion
	 data.restauranteObj.wifi = req.body.restauranteObj.wifi
	 data.restauranteObj.disclaimer = req.body.restauranteObj.disclaimer
	 data.restauranteObj.costTarget = req.body.restauranteObj.costTarget 
	 data.restauranteObj.serviceTax = req.body.restauranteObj.serviceTax
	 data.restauranteObj.SaleTax = req.body.restauranteObj.SaleTax
	 
     data.save(function(err, response){
      if(err){ 
         console.log(err);
         var errormessage;
         if(err.code == 11000){
            errormessage = messages.useralreadyexists
         }
         return res.json(helpers.response(400,false,0,errormessage)) 
       }

       var mailcontent = {
              from: 'no-reply@meanapp.com', // sender address
              to: data.email, // list of receivers
              subject: 'Welcome to Our Portal', // Subject line
              html: `<p>Hi ${data.firstname} ${data.lastname}<p>
                            <p>Here is the login information to the portal<br />
                                URL: ${config.environment().url_domain},<br />
                                username: ${data.email},<br />
                                password: ${password}<br />
                             
                                Regards,<br />
                                MeanApp</p>
                        ` // html body
            }
            mail.sendEmail(mailcontent);
            if(response._id){
              return res.json(helpers.response(200,true,0,messages.usercreationSuccess))      
            }
            else{
              return res.json(helpers.response(409,false,0,messages.usercreationFailed))      
            }
         
   });
});

app.post('/api/v1/update/user', function (req, res) {
var sess = req.session;

    var id = req.body._id

    User.findById(id, function(err, user ) {
    if (!user)
      return next(new Error('Could not load Document'));
    else {
      
      
    var password;
    if(req.body.password){
     
      var salt = user.salt
      password = common.crypto.pbkdf2Sync(req.body.password, salt, 1000, 64,'sha512').toString('hex');
    }
    else{
      password = user.password
    }

     user.firstname = req.body.firstname
     user.lastname =  req.body.lastname
     user.role = req.body.role
     user.phone = req.body.phone
     var username = helpers.username(req.body.firstname+' '+req.body.lastname)
     user.username = username
     user.email =   req.body.email
     user.password = password
     
     user.updated_at =   Date.now()
     user.updated_by =   sess.userid;
     
     user.restauranteObj.rName = req.body.restauranteObj.rName
	 user.restauranteObj.lName = req.body.restauranteObj.lName
	 user.restauranteObj.cJuridica = req.body.restauranteObj.cJuridica
	 user.restauranteObj.telefono = req.body.restauranteObj.telefono
	 user.restauranteObj.direccion = req.body.restauranteObj.direccion
	 user.restauranteObj.wifi = req.body.restauranteObj.wifi
	 user.restauranteObj.disclaimer = req.body.restauranteObj.disclaimer
	 user.restauranteObj.costTarget = req.body.restauranteObj.costTarget 
	 user.restauranteObj.serviceTax = req.body.restauranteObj.serviceTax
	 user.restauranteObj.SaleTax = req.body.restauranteObj.SaleTax
     
        
        if(req.body.password){
       
          var mailcontent = {
              from: 'no-reply@tech.com', // sender address
              to: user.email, // list of receivers
              subject: 'Welcome to Our Portal', // Subject line
              html: `<p>Hi ${user.firstname} ${user.lastname}<p>
                            <p>Here is the login information to the portal<br />
                                URL: <a href="${config.environment().url_domain}" target="_blank"> Go to App</a>,<br />
                                username: ${user.email},<br />
                                password: ${req.body.password}<br />

                                Regards,<br />
                                MeanApp</p>
                        ` // html body
            }
            mail.sendEmail(mailcontent);
          }
      user.save(function(err) {
        if (err){
          console.log('Update User error');
          console.log(err);
          return res.json(helpers.response(400,false,0,err.errmsg)) 
        }
        else{
          return res.json(helpers.response(200,true,0,messages.userUpdationSuccess)) 
        }
      });
    }
  });
});

app.post('/api/v1/user/delete/:id', function (req, res) {
  var id = req.params.id

 User.findById(id, function(err, user ) {
    if (!user)
      return next(new Error('Could not load Document'));
    else {
      user.active = 0
      user.updated_by =   sess.userid
      user.save(function(err) {
        if (err){
          console.log('Delete User error');
          console.log(err);
          return res.json(helpers.response(400,false,0,err.errmsg)) 
        }
        else{
          return res.json(helpers.response(200,true,0,messages.userdelete)) 
        }
      });
    }
 });

});

app.post('/api/v1/user/hard/delete/:id', function (req, res) {
  var id = req.params.id
  User.remove({_id:id}, function(err, users){
     return res.json(helpers.response(200,true,0,messages.userdelete))  
  });

});

/**
 *  Retrieve token for the current user
 */

app.get('/api/v1/tokenGet', function (req, res) {

  var sess = req.session;
  if(sess.userid){
     User.find({active:1,_id: sess.userid}, { token: 1 },function(err, users){
       if (err) { 
          console.log('Error On token error');
          console.log(err);
          return res.json(helpers.response(400,false,0,err.errmsg)) 
       }
          return res.json(helpers.response(200,true,users,0)) 
    });
  }
  else{
    console.log(err)
    console.log(users)
     return res.json(helpers.response(401,false,0,messages.unauthorized)) 
  }

});

/**
 *  Generate new token for the current user
 */

app.post('/api/v1/generatetoken', function (req, res) {

  var sess = req.session;
  if(sess.email){

     var email = sess.email;
     var token =   helpers.tokenizer(email)
     var newtoken =   token
     return res.json(helpers.response(200,true,newtoken,messages.done)) 
  }
  else{
     return res.json(helpers.response(401,false,0,messages.unauthorized)) 
  }

});

/**
 *  Generate new token for the current user
 */

app.post('/api/v1/savetoken', function (req, res) {

  var sess = req.session;
  if(sess.email){

    var newtoken = req.body.tokenvar;

    var id = sess.userid
    User.findById(id, function(err, user ) {
    if (!user)
     return res.json(helpers.response(400,false,0,messages.nouser)) 
    else {
     
     user.token = newtoken
   
      user.save(function(err) {
        if (err){
          console.log('Update User error with token');
          console.log(err);
          return res.json(helpers.response(400,false,0,err.errmsg)) 
        }
        else{
          return res.json(helpers.response(200,true,0,messages.tokenupdated)) 
        }
      });
    }
  });
  }
  else{
     return res.json(helpers.response(401,false,0,messages.unauthorized)) 
  }

});

// Forgot password

app.post('/api/requestnewpassword', function (req, res) {
  var emailerh = req.body.forgotpassword
  
  var auth = emailerh // req.body.auth
  var reqtime = Date.now() / 1000 | 0;

  var linkBuilder;
  //var enctime = helpers.encrypt(reqtime);
  var encemail = helpers.encrypt(auth);
  
  
  var data = new UserAction();
  data.emailid = emailerh // req.body.auth;
  data.token = reqtime;

  //linkBuilder ="utm_camp="+reqtime+"&utm_hipher="+emailerh
  linkBuilder ="utm_camp="+reqtime+"&utm_hipher="+encemail

   User.find({active:1,email: auth},function(err, users){
    if (users.length <= 0)
      return res.json(helpers.response(401,false,0,messages.nouser)) 
    else {

      data.save(function(err, response){
            if(err){ 
               console.log(err);
               var errormessage;
               
               return res.json(helpers.response(400,false,0,err)) 
             }

             var mailcontent = {
                    from: 'no-reply@meanapp.com', // sender address
                    to: auth, // list of receivers
                    subject: 'Welcome to Our Portal', // Subject line
                    html: `<p>Hi <p>
                                  <p>Here is the password reset information to the portal<br />
                                      URL: <a href="${config.environment().url_domain}resetpassword?${linkBuilder}"> Reset Here </a><br />
                                         This link will expire in 5 minutes.<br>

                                      Regards,<br />
                                      MeanApp</p>
                              ` 
                  }
                  mail.sendEmail(mailcontent);
                  if(response._id){
                    return res.json(helpers.response(200,true,0,messages.forgotmailsent))      
                  }
                  else{
                    return res.json(helpers.response(409,false,0,messages.forgotmailsenterr))      
                  }
      });
     
    }
    });
});


// Check User request for reset-password authentication 

app.post('/api/forgotpassword', function (req, res) {
  var newpassword = req.body.new
  var confirmpassword = req.body.new
  var auth = req.body.email
  var token = req.body.token
  //auth = helpers.decrypt(auth);
  auth =  helpers.decrypt(auth);
  console.log("auth")
  console.log(auth)
  UserAction.find({status:"P",emailid: auth,token: token},function(err, users){
    if(!users){
        return res.json(helpers.response(409,false,0,messages.actionnotcompleted))      
    }
    else{
      if(users.length <= 0){
        return res.json(helpers.response(409,false,0,messages.cannotchangepassword))      
      }
       var emailUser = users[0].emailid
       var actionId = users[0]._id
        
      if(users.length > 0){

        var rightNow = Date.now() / 1000 | 0;
        var diff = (rightNow - token);
 
        if (diff > config.appConfig().forgotpasswordLinkExpire) {
            return res.json(helpers.response(403,false,0,messages.linkexpired)) 
        }
        else{
            //Can Change change password
            User.find({email:emailUser}, function(err, user) {
            
              if (!user){
                 return res.json(helpers.response(409,false,0,messages.actionnotcompleted))  
              }    
              else {

              var salt = user[0].salt
              var id = user[0]._id
              var password = common.crypto.pbkdf2Sync(newpassword, salt, 1000, 64,'sha512').toString('hex');

               user[0].password = password
               user[0].updated_by =  id
                  var mailcontent = {
                        from: 'no-reply@tech.com', // sender address
                        to: user[0].email, // list of receivers
                        subject: 'Changed Password Successfully', // Subject line
                        html: `<p>Hi ${user[0].firstname} ${user[0].lastname}<p>
                                      <p>You have successfully changed your password.<br>
                                       
                                          Regards,<br />
                                          MeanApp</p>
                                  ` 
                      }
                      mail.sendEmail(mailcontent);
                  
                user[0].save(function(err) {
                  if (err){
                    console.log('Change Password User error');
                    console.log(err);
                    return res.json(helpers.response(400,false,0,err.errmsg)) 
                  }
                  else{
                    UserAction.findById(actionId, function(err, actions ) {
                      console.log(actions)
                      if (!actions)
                        return res.json(helpers.response(409,false,0,messages.actionnotcompleted))  
                      else {
                        actions.status = "D"
                        actions.save(function(err, user) {
            
                            if (!user){
                               return res.json(helpers.response(409,false,0,messages.actionnotcompleted))  
                            }    
                            else {
                              return res.json(helpers.response(200,true,0,messages.passwordchanged)) 
                            }
                          })
                      }
                    })
                    
                  }
                });
              }
            });
        }
      }
      else{
        console.log(messages.notrequestedchange)
        return res.json(helpers.response(403,false,0,messages.notrequestedchange)) 
      }
    }
  })

});


} // user module ENDS
