var common = require('../helpers/common.js');
var keys = common.constants.keys()
var response = { status  : null, success : null, data : null }; // status provide conditions of api request, success states the resultant status of api(boolean), data return data from api
var sess = {}; // common session constant
const helpers = common.helpers;
const messages = common.constants.messages();


module.exports = function (app,sessionMiddleware) {


//Models Required
  var Employee = common.mongoose.model('Employee');

  var io = require('socket.io')(app);
  
  io.use(function(socket, next) {
   
      sessionMiddleware(socket.request, socket.request.res, next);
  });
 
  io.on('connection', function (socket) {

    

    var currentTime = new Date();
    console.log('Connection established', currentTime);

    socket.emit('init', {
      name: 'Daniel',
      desc: 'Create this for socket experimentation'
    })
    

    socket.on('dbSync:online', function (data) {
      console.log(data, new Date())
    })

    socket.on('dbSync:offline', function (data) {
      console.log(data, new Date())
    })

    // Emplyoee Session sync
    
     socket.on('auth:online', function(data){
      console.log("session sync" , data.data.val)
     // console.log(data.data.val)
     // socket.request.session.employee = {}
      socket.request.session.employee = data.data.val
     
      socket.request.session.save( function(err) {
          socket.request.session.reload( function (err) {
               socket.emit('authresponse:online',helpers.response(200,true,1,messages.syncesessionuser));
          });
      });


       

     }); 
   socket.on('authemployeeout:online', function(data){
      console.log("session sync authemployeeout" , data)
     // console.log(data.data.val)
     // socket.request.session.employee = {}

      delete socket.request.session.employee;
      socket.request.session.save( function(err) {
          socket.request.session.reload( function (err) {
               socket.emit('authresponse:online',helpers.response(200,true,1,messages.syncesessionuser));
          });
      });


       

     }); 

     // Emplyoee profile sync
    
     socket.on('emplyeeprofile:online', function(data){
     
      console.log("Employee sync")

      var dumpdata = data.data.dump

       Employee.find({_id:dumpdata._id} ,function(err, users){
       if (err) {
        socket.emit('emplyeeprofilereponse:online', helpers.response(403,false,0,err)); 
       }
      else{
        var updated_user = users[0];

            updated_user.firstname = dumpdata.firstname
            updated_user.lastname = dumpdata.lastname
            updated_user.dateofbirth = dumpdata.dateofbirth
            updated_user.phone = dumpdata.phone
            updated_user.pin = dumpdata.pin
            updated_user.email = dumpdata.email
            updated_user.position = dumpdata.position
            updated_user.save(function(err,employee){  
                  if(err)  { 
                    console.log(err);
                    socket.emit('emplyeeprofilereponse:online', helpers.response(403,false,0,messages.updatefailed)); 
                     //return res.json(helpers.response(403,false,0,messages.updatefailed)) 
                  }
                  socket.emit('emplyeeprofilereponse:online', helpers.response(200,true,1,messages.updateSuccess)); 
                // return res.json(helpers.response(200,true,1,messages.loginsuccessful))               
            })


         }
      });

     });

  })
}
