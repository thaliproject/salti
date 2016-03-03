'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

//path.verb.role
var acl = require('./acl-get-multipleusers.js');


describe('fatfinger - user - mixed and duplicate', function () {

  var app;
  var router;

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

    describe('fatfinger verbs to /fatfinger', function () {
    it('shoudl be OK - 200', function (done) {
      request(app)
        .get('/fatfinger')
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('shoudl be OK - 200', function (done) {
      request(app)
        .put('/fatfinger')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('shoudl be OK - 200', function (done) {
      request(app)
        .post('/fatfinger')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
  })

})

describe('fatfinger - public - no public all', function () {

  var app;
  var router;

  before(function () {
    app = express();
    router = express.Router();
    
    //mocker..
    router.all('*', function (req, res, next) {
      req.connection.pskIdentity= 'public';
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

    describe('fatfinger - public no verbs', function () {
    it('should be 401', function (done) {
      request(app)
        .get('/fatfinger')
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(401, done);
    })
    it('should be 401', function (done) {
      request(app)
        .put('/fatfinger')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(401, done);
    })
    it('should be 401', function (done) {
      request(app)
        .post('/fatfinger')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(401, done);
    })
  })

})

