/**
  * @author Akhil Gopan - akhil.gopan@techversantinfotech.com
  * @desc Employee Operation for the application
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

    var Shift = common.mongoose.model('Shift');
    var Order = common.mongoose.model('Order');
    var Invoice = common.mongoose.model('Invoice');
    var Ingredients = common.mongoose.model('Ingredients');
    var Sides = common.mongoose.model('Sides');
    

    app.get('/api/get/getshift', function (req, res) {
        // Shift.find({}, function (err, result) {
        //     if (err) {
        //         console.log(err);
        //         res.json(err);
        //     }
        //     return res.json(result);
        // });

        Shift.find({ restaurant: req.headers.logedinuserid })
           .populate('orders')
           .populate({
               path: 'invoices',
               // Get friends of friends - populate the 'friends' array for every friend
               populate: { path: 'servedby' }
           })
            .populate('idsshiftopenedby')
           .exec(function (err, result) {

               if (err) {
                   console.log(err);
                   res.json(0);
               }
               else {
                   var options = {
                       path: 'orders.product',
                       model: 'Product'
                   };
                   Shift.populate(result, options, function (err, projects) {

                       var options1 = {
                           path: 'invoices.orders',
                           model: 'Order'
                       };

                       Shift.populate(projects, options1, function (err, allproject) {
                           var options2 = {
                               path: 'invoices.orders.product',
                               model: 'Product'
                           };

                           Shift.populate(allproject, options2, function (err, data) {

                               var options3 = {
                                   path: 'invoices.tables',
                                   model: 'Table'
                               };

                               Shift.populate(data, options3, function (err, alldata) {
                                   return res.json(alldata);

                               });
                           });
                       });



                   });

               }

           });
    });


    app.get('/api/get/getshiftByTime', function (req, res) {
        // Shift.find({}, function (err, result) {
        //     if (err) {
        //         console.log(err);
        //         res.json(err);
        //     }
        //     return res.json(result);
        // });
        

        Shift.find({ restaurant: req.headers.logedinuserid , starttime: {"$gte": req.query.startdate, "$lt": req.query.enddate} })
           .populate('orders')
           .populate({
               path: 'invoices',
               // Get friends of friends - populate the 'friends' array for every friend
               populate: { path: 'servedby' }
           })
            .populate('idsshiftopenedby')
           .exec(function (err, result) {

               if (err) {
                   console.log(err);
                   res.json(0);
               }
               else {
                   var options = {
                       path: 'orders.product',
                       model: 'Product'
                   };
                   Shift.populate(result, options, function (err, projects) {

                       var options1 = {
                           path: 'invoices.orders',
                           model: 'Order'
                       };

                       Shift.populate(projects, options1, function (err, allproject) {
                           var options2 = {
                               path: 'invoices.orders.product',
                               model: 'Product'
                           };

                           Shift.populate(allproject, options2, function (err, data) {

                               var options3 = {
                                   path: 'invoices.tables',
                                   model: 'Table'
                               };

                               Shift.populate(data, options3, function (err, alldata) {
                                   Ingredients.find({ restaurant: req.headers.logedinuserid }, function (err, ing) {
                                       var ings = ing;
                                       if (err)
                                           ings = null;
                                       Sides.find({ restaurant: req.headers.logedinuserid }, function (err, Sides1) {
                                           if (err) {
                                               return res.json({ ShiftData: alldata, IngridentData: ings, Sidedata: null });
                                           } else {
                                               return res.json({ ShiftData: alldata, IngridentData: ings, Sidedata: Sides1 });
                                           }
                                       });
                                   })
                               });
                           });
                       });



                   });

               }

           });
    });








} // employee module ENDS
