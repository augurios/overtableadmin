var common = require('../helpers/common');

/*Models*/
const userModel = require('../model/Users');
const permissionModel = require('../model/Permission');
const UserLogged = require('../model/UserLogged');
const Employee = require('../model/Employee');

module.exports = function (app) {

  //global constants/paths
  app.get('/auth/getpaths', function (req, res) {
       res.json(common.constants.define());
  });

   require('../controller/init')(app);
   require('../controller/employee')(app);
  //application to send every request to index.html
  
  app.get('*', function (req, res) {
 	 res.sendfile('./public/template/index.html'); 
  });
}