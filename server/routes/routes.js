var common = require('../helpers/common');

/*Models*/
const userModel = require('../model/Users');
const permissionModel = require('../model/Permission');
const userActions = require('../model/userAction');
const EmployeeModel = require('../model/Employee');
const Shift = require('../model/Shift');
const Invoice = require('../model/Invoice');
const Order = require('../model/Order');
const Product = require('../model/Product');
const Table = require('../model/Table');
const Room = require('../model/Room');
const Ingredients = require('../model/Ingredients');
const Sides = require('../model/Sides');
const Category = require('../model/Category');
const Production = require('../model/Production');
const ExpenceReport = require('../model/ExpenceReport');
module.exports = function (app) {

  //global constants/paths
   app.get('/auth/getpaths', function (req, res) {
         res.json(common.constants.define());
  });

  //token verification test route
  app.get('/api/v1/getdata', function (req, res) {
         res.json(common.constants.define());
  });

  /**
	  * @desc including sub modules/controller files 
	**/
  require('../controller/user')(app);
  require('../controller/usermangement')(app);
  require('../controller/permission')(app);
  require('../controller/employee')(app);
  require('../controller/restaurant')(app);
  require('../controller/shift')(app);
  require('../controller/room')(app);

  //application to send every request to index.html
  
  app.get('*', function (req, res) {
 	 res.sendfile('./public/template/index.html'); 
  });




}