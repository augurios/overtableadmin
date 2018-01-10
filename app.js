var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');
var debug = require('debug')('project:server');
var session = require('express-session');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var MongoDBStore = require('connect-mongodb-session')(session);


var app = express();
var router = express.Router();

require('./server/model/Users');
require('./server/config/passport');

var common = require('./server/helpers/common');

var port = common.config.environment().port
var credential = common.db_access.dbconfig();
var keys = common.constants.keys();

app.set('port', port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', serveStatic(__dirname + '/public')); // serve static files
app.use('/vendors', serveStatic(__dirname + '/vendors')); // serve static files

app.set('superSecret', keys.sessionkey); // secret variable
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});
var db = require('./server/config/database').dbconfig();

mongoose.connect(db.connectionstring);

var date = new Date();
date.setTime(date.getTime()+(1 * 2 * 60 * 60 * 1000)); // 2 hours
//1000 * 60 * 60 * 24 * 7 // 1 week 
var store = new MongoDBStore(
      {
        uri: db.connectionstring,
        collection: db.collection.session_collection
      });
 
    // Catch errors 
    store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });
 
    app.use(require('express-session')({
      secret: keys.sessionkey,
      store: store,
      saveUninitialized: false, 
      resave: true,
      name: 'MySerVerapp',
      saveUninitialized: true,
      cookie: { maxAge:  date }  
}));



// apply the routes to our application with the prefix /api
app.use('/api/v1/', router);

require('./server/routes/routes.js')(app,router); // Main Route File
http.createServer(app).listen(port); // create server

console.log("App listening on port " + port);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err)
  res.status(err.status || 500);
  res.redirect('/error');
});

