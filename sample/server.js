/* jshint node: true */
'use strict';

var express = require('express'),
  https = require('https'),
  http = require('http'),
  fs = require('fs'),
  app = express(),
  PouchDB = require('pouchdb'),
  router = express.Router(),
  debug = require('debug')('thalisalti:express');

//this is our sample UI site on port https://localhost:3000
// the 2 express apps:
var webApp = require('./app');
var webAppPort = normalizePort(process.env.PORT || '3000');

var serverCommonOptions = {
  key: loadPEM('key'),
  cert: loadPEM('key-cert')
};

webApp.set('port', webAppPort);
var webServer = https.createServer(serverCommonOptions, webApp);
webServer.listen(webAppPort, function () {
  debug('webServer is listening on port %s', webAppPort);
});
webServer.on('error', onError);

var pbsetup = PouchDB.defaults({ prefix: './db/' });
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
router.all('*', acllib('db', acl, function (thaliId) {
  debug('thaliId %s', thaliId);
}));

var pouchApp = require('express-pouchdb')(pbsetup, opts);

router.use('/', pouchApp);
app.use('/', router);

app.listen(pouchPort);


// various utility functions...

// cert/pem loaders
function filenamePEM(n) {
  return require('path').join('./', n + '.pem');
}

function loadPEM(n) {
  return fs.readFileSync(filenamePEM(n));
}

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
