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
    var Room = common.mongoose.model('Room');
    var Table = common.mongoose.model('Table');

    app.get('/api/get/room', function (req, res) {
        console.log(req.headers);
        var resid = req.headers['logedinuserid'];
        if (resid) {
            Room.find({ restaurant: resid })
           .populate('tableNum')
           .exec(function (err, result) {
               if (err) {
                   console.log(err);
                   res.json(0);
               }
               else {
                   res.json(result);
               }
           });
        } else {
            res.json([]);
        }
    });

    app.post('/api/v1/editRoom', function (req, res) {
        Room.findOneAndUpdate({ _id: req.body._id }, req.body, function (err, result) {
            if (err) {
                console.log('error')
                return res.json({ Error: 'Unexpected error' })
            }
            else {
                console.log('success')
                return res.json({ message: 'Update Successfully' })
            }
        });
    });

    app.post('/api/table/updatenumber', function (req, res) {
	    console.log("update body: " + req.body);
        Table.findById(req.body.id, function (err, table) {
            if (err) {
                console.log('error')
                return res.json({ Error: 'Unexpected error' })
            }
            else {
                table.number = req.body.number;
                table.style = req.body.style;
                table.rotation = req.body.rotation;
                table.save(function (err) {
                    if (err) {
                        console.log('Update User error');
                        console.log(err);
                        return res.json(helpers.response(400, false, 0, err))
                    }
                    else {
                        return res.json(helpers.response(200, true, 0, "update success"))
                    }
                });
            }
        });
    });

    app.post('/api/room/changestatus', function (req, res) {
        Room.findById(req.body.id, function (err, room) {
            if (err) {
                console.log('error')
                return res.json({ Error: 'Unexpected error' })
            }
            else {
                room.active = req.body.status;
                room.save(function (err) {
                    if (err) {
                        console.log('Update User error');
                        console.log(err);
                        return res.json(helpers.response(400, false, 0, err))
                    }
                    else {
                        return res.json(helpers.response(200, true, 0, "update success"))
                    }
                });
            }
        });
    });

    app.post('/api/table/delete', function (req, res) {
        Table.findByIdAndRemove(req.body.id, function (err, result) {
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.json({ message: 'Update Successfully' })
        });
    });

    app.post('/api/room/delete', function (req, res) {
        console.log(req.body.id);
        Room.findById(req.body.id, function (err, room) {
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            console.log(room);
            
            if (room && room.tableNum) {
                for (var cnt = 0; cnt < room.tableNum.length; cnt++) {
                    Table.findByIdAndRemove(room.tableNum[cnt], function (err, result) {
                        console.log({ message: 'table deleted' })
                    });
                }
            }

            Room.findByIdAndRemove(req.body.id, function (err, result) {
                console.log({ message: 'table deleted' })
                return res.json({ message: 'Deleted Successfully' })
            });

        });
    });


    app.post('/api/v1/addroom', function (req, res) {
        Room.find({ name: req.body.name }, function (err, rooms) {
            if (rooms && rooms.length > 0) {
                return res.json({ iserror: true, message: "Duplicate room name" });
            } else {
                var room = new Room(req.body);
                room.save(room, function (err, result) {
                    console.log(result);
                    return res.json({ iserror: false, message: result });
                });
            }
        });
    })

    app.post('/api/v1/addtable', function (req, res) {
        Table.find({}).exec(function (err, result) {
            if (err) {
                console.log(err);
                res.json(0);
            } else {
                if (!result) {

                }
                //req.body.number = result[result.length - 1] == undefined ? 1 : result[result.length - 1].number + 1;
                var table = new Table(req.body);
                if (table) {
                    table.save(table, function (err, result) {
                        console.log(result);
                        return res.json(result);
                    });
                }
                else {
                    return res.json(helpers.response(401, false, 0, messages.unauthorized))
                }

            }


        });



    })



} // employee module ENDS
