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
var Employee = common.mongoose.model('Employee');

/**
 * Create an employee against an restuarant
 */

app.post('/api/v1/create/employee', function (req, res) {

     var sess = req.session;
     var id = (req.body.restaurant) ? req.body.restaurant : sess.userid

     var data = new Employee();
     data.firstname = req.body.fname
     data.lastname =  req.body.lname
     data.email =   req.body.email
     data.pin = req.body.pin
     data.phone = req.body.phone
     data.role = req.body.role
     data.dateofbirth = req.body.dob
     data.restaurant = id
     data.position = req.body.position

     data.created_by =   sess.userid
     data.updated_by =   sess.userid


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
                            <p>Here is the login information to the portal(employee)<br />
                                URL: ${config.environment().url_domain_lanapp},<br />
                                pin: ${data.pin}<br />
                             
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

/**
 *  Get Employee List
 */

app.get('/api/v1/get/employee', function (req, res) {
 var sess = req.session;

 if(sess.role && sess.role == "admin"){
    Employee.find({active:1}, { firstname: 1,lastname:1, email:1, role:1, phone:1, pin:1, position: 1, dateofbirth : 1, restaurant: 1 },function(err, users){
       if (err) { console.log(err); res.json(0); }
         return res.json(helpers.response(200,true,users,0)) 
    }).populate("restaurant");
 }
 else if(sess.role){
     Employee.find({active:1,restaurant: req.session.userid}, { firstname: 1,lastname:1, email:1, role:1, phone:1, pin:1, position: 1, dateofbirth : 1 },function(err, users){
       if (err) { console.log(err); res.json(0); }
         return res.json(helpers.response(200,true,users,0)) 
    });
  }
  else{
     return res.json(helpers.response(401,false,0,messages.unauthorized)) 
  }
})

/**
 * Update an employee against his ID 
 */

app.post('/api/v1/update/employee', function (req, res) {
    var sess = req.session;
        
    var id = req.body._id

    Employee.findById(id, function(err, emp ) {
      if (!emp)
        return next(new Error('Could not load Document'));
      else {
         emp.firstname = req.body.firstname
         emp.lastname =  req.body.lastname
         emp.email =   req.body.email
         emp.pin = req.body.pin
         emp.phone = req.body.phone
         emp.role = req.body.role
         emp.dateofbirth = req.body.dateofbirth
         emp.position = req.body.position

         emp.updated_at =   Date.now()
         emp.updated_by =   sess.userid

        var mailcontent = {
              from: 'no-reply@tech.com', // sender address
              to: emp.email, // list of receivers
              subject: 'Welcome to Our Portal', // Subject line
              html: `<p>Hi ${emp.firstname} ${emp.lastname}<p>
                            <p>Here is the login information to the portal<br />
                                URL: <a href="${config.environment().url_domain_lanapp}" target="_blank"> Go to App</a>,<br />
                                pin: ${emp.pin}<br />

                                Regards,<br />
                                MeanApp</p>
                        ` // html body
            }
            mail.sendEmail(mailcontent);
          
          emp.save(function(err) {
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
    })
});


/**
 * Update an employee against his ID 
 */

app.post('/api/v1/employee/delete/:id', function (req, res) {
    var sess = req.session;
        
    var id = req.params.id

    Employee.findById(id, function(err, emp ) {
      if (!emp)
        return res.json(helpers.response(400,false,0,messages.nouser)) 
      else {
            emp.active = 0
            emp.updated_by =   sess.userid
            emp.save(function(err) {
              if (err){
                console.log('Delete Employee error');
                console.log(err);
                return res.json(helpers.response(400,false,0,err.errmsg)) 
              }
              else{
                return res.json(helpers.response(200,true,0,messages.userdelete)) 
              }
            });
          }

      })
 
})

//Check Existence employee for pin
app.post('/auth/pin', function (req, res) {
var pin = req.body.pin

var subscription = req.body.subscription ? req.body.subscription : 'null';
var restaurantid = req.body.restaurant ? req.body.restaurant : 'null';

if(subscription == 'null'){
  //When Add
    Employee.find({ 'pin':pin ,restaurant: restaurantid, 'active': 1}, function(err, user) {

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
    Employee.find({"_id" : {"$ne" : [subscription]},"pin":pin, active: 1}, function(err, user) {
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

//Check Existence employee for email
app.post('/auth/employee-email', function (req, res) {
var email = req.body.email

var subscription = req.body.subscription ? req.body.subscription : 'null';
var restaurantid = req.body.restaurant ? req.body.restaurant : 'null';

if(subscription == 'null'){
  //When Add
    Employee.find({ 'email':email ,restaurant: restaurantid, active: 1}, function(err, user) {

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
    Employee.find({"_id" : {"$ne" : [subscription]},"email":email, active: 1}, function(err, user) {
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


} // Employee module ENDS
