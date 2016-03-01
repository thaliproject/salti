'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

//path.verb.role
var acl = require('./acl-get-multipleusers.js');


describe('user - all', function () {

  var app;
  var router;

  before(function () {
    app = express();
    router = express.Router();
    
    //mocker..
    router.all('*', function (req, res, next) {
      req.headers.identity = 'user';
      next();
    })
    
    //Norml middleware usage..
    router.all('*', lib(acl));

    //mock handlers
    var handlers = require('./handlers');

    router.get('/publicget', handlers[0]);
    router.post('/publicget', handlers[1]);
    router.put('/publicget', handlers[2]);
    app.use('/', router);

  })

    describe('publicget verbs', function () {
    it('shoudl be OK - 200', function (done) {
      request(app)
        .get('/publicget')
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('shoudl be OK - 200', function (done) {
      request(app)
        .put('/publicget')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('shoudl be OK - 200', function (done) {
      request(app)
        .post('/publicget')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
  })

})

describe('publicget - public - only get', function () {

  var app;
  var router;

  before(function () {
    app = express();
    router = express.Router();
    
    //mocker..
    router.all('*', function (req, res, next) {
      req.headers.identity = 'public';
      next();
    })
    
    //Norml middleware usage..
    router.all('*', lib(acl));

    //mock handlers
    var handlers = require('./handlers');

    router.get('/publicget', handlers[0]);
    router.post('/publicget', handlers[1]);
    router.put('/publicget', handlers[2]);
    app.use('/', router);

  })

    describe('publicget - just get', function () {
    it('should be 200', function (done) {
      request(app)
        .get('/publicget')
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('should be 401', function (done) {
      request(app)
        .put('/publicget')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(401, done);
    })
    it('should be 401', function (done) {
      request(app)
        .post('/publicget')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(401, done);
    })
  })

})

