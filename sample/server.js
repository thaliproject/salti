/* jshint node: true */
'use strict';

var express = require('express'),
  http = require('http'),
  fs = require('fs'),
  app = express(),
  PouchDB = require('pouchdb'),
  router = express.Router(),
  debug = require('debug')('thalisalti:express');

//this is our sample UI site on port http://localhost:3000
// the 2 express apps:
var webApp = require('./app');
var webAppPort = normalizePort(process.env.PORT || '3000');

webApp.set('port', webAppPort);
var webServer = http.createServer(webApp);
webServer.listen(webAppPort, function () {
  debug('webServer is listening on port %s', webAppPort);
});
webServer.on('error', onError);

// prefix dir should exist.
var prefixDir = './db';
if (!fs.existsSync(prefixDir)){
    fs.mkdirSync(prefixDir);
}
var pbsetup = PouchDB.defaults({ prefix: prefixDir + '/' });
var pouchPort = normalizePort(process.env.PORT2 || '3001');

var opts = {
  mode: 'minimumForPouchDB',
  overrideMode: {
    include: ['routes/fauxton']
  }
}

var acllib = require('../lib/index');
var acl = require('./pouchdb');
//mocker..
router.all('*', function(req, res, next) {
  req.connection.pskRole = 'public';
  next();
});
//Norml middleware usage..
router.all('*', acllib('foobarrepl', acl, function (thaliId) {
  debug('thaliId %s', thaliId);
  return thaliId == 'my_thali_id';
}));

var pouchApp = require('express-pouchdb')(pbsetup, opts);

router.use('/', pouchApp);
app.use('/', router);

app.listen(pouchPort);


// various utility functions...

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error, parent) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof error.port === 'string'
     ? 'Pipe ' + error.port
     : 'Port ' + error.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
