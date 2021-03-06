// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var expressLayouts = require('express-ejs-layouts')
//var favicon = require('serve-favicon');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var colors				= require('colors');
var constants			= require('./scripts/constants');
var config        = require(constants.paths.config + '/config');
var multer = require('multer');

// configuration ===============================================================
require('./scripts/database'); // load database management scripts
require('./scripts/process'); // load process management scripts
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('layout', 'layouts/mmain')

// set development environment configuration
if (app.get('env') === 'development') {
  app.locals.pretty = true;		//render html output with proper formating
}

if(config.get('env') === 'production') {
  app.locals.pretty = true;
}

if(config.get('env') === 'test') {
  app.locals.pretty = true;
}
app.use(expressLayouts);

// required for passport
require('./scripts/session')(app);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//multer for storing images locally and dynamically based on the entity value.
app.use('/api/v1/upload/:entity',multer({
  dest: './public/uploads/jd/',
  rename:function(fieldname,filename,req){
    console.log(req.params);
    return req.params.entity;
  },
  changeDest: function(dest, req, res) {
    console.log(req.params.entity);
    return dest;
  },
  onFileUploadComplete: function(file) {
    console.log(file.fieldname + ' uploaded to the ' + file.path);
  }
}));

//multer for storing images locally and dynamically based on the entity value.
app.use('/api/v1/multiupload/:entity',multer({
  dest: './public/uploads/',
  rename:function(fieldname,filename){
   return filename + '_' + Date.now();
 },
 changeDest: function(dest, req, res) {
  console.log(req.params.entity);
  return dest;
},
onFileUploadComplete: function(file) {
  console.log(file.fieldname + ' uploaded to the ' + file.path);
}
}));
// routes ======================================================================
require('./routes/main')(app, passport);

// launch ======================================================================
//app.listen(port);

var util = require('./scripts/util');
var appInfoServ = require('./services/appService');

var appInfo = appInfoServ.info();
console.log(colors.blue(util.formatString("\nApplication: %s ver %s:%s", appInfo.name, appInfo.version, appInfo.gitHash )));
console.log(colors.blue(util.formatString('   running at port %s', port)));


var http = require('http').Server(app);
var io = require('socket.io').listen(http);


io.sockets.on('connection', function(socket){
    console.log ("Client connection");
    
    socket.on("send message", function(data){
       io.sockets.emit("new message", data);
    });
});

http.listen('8080', function(){
    console.log("Listening on port 8080 njaannanannannanan");    
       
});

app.use(express.static(__dirname +'/public'));;

app.use(express.static(__dirname +'/bower_components'));