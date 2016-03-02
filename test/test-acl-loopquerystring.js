'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));
//path.verb.role
var acl = require('./acl-get-multipleusers.js');

function generateString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%^&*()-_+=!@~<>?/.,[]}{\|}";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

var app;
var router;
var randomPaths = new Array(1000);

var testTimeout = 20000;

for (var i = 0; i < randomPaths.length; i++) {
  var randomString = generateString(40);
  randomPaths[i] = randomString;
}

for (var i = 0; i < randomPaths.length; i++) {
  var randomString = generateString(40);
  randomPaths[i] = randomString;
}


function makeTest(path, status) {
  it('testing path and should be ' + status + ' for ' + path, function (done) {
    request(app)
      .post(path)
      .send({ message: "stuff" })
      .expect(status)
      .end(done);
  });
}

describe('this is the loop for passing tests', function () {
  this.timeout(testTimeout);
  before(function () {

    app = express();
    router = express.Router();
    //mocker..
    router.all('*', function (req, res, next) {
      req.connection.pskIdentity = 'user';
      next();
    })
    //Norml middleware usage..
    router.all('*', lib(acl));
    //mock handlers
    var handlers = require('./handlers');
    router.get('/fatfinger', handlers[0]);
    router.post('/fatfinger', handlers[1]);
    router.put('/fatfinger', handlers[2]);
    app.use('/', router);

  })

  //these tests have a ? for query string.
  for (var i = 0; i < randomPaths.length; i++) {
    makeTest('/fatfinger?' + randomPaths[i], 200);
  }
  return;
})

describe('this is the loop for failing tests', function () {
  this.timeout(testTimeout);
  before(function () {

    app = express();
    router = express.Router();
    //mocker..
    router.all('*', function (req, res, next) {
      req.connection.pskIdentity = 'user';
      next();
    })
    //Norml middleware usage..
    router.all('*', lib(acl));
    //mock handlers
    var handlers = require('./handlers');
    router.get('/foo', handlers[0]);
    router.post('/foo', handlers[1]);
    router.put('/foo', handlers[2]);
    app.use('/', router);

  })

  // this has NO ? for query string
  for (var i = 0; i < randomPaths.length; i++) {
    makeTest('/foo?' + randomPaths[i], 401);
  }
  return;
})
