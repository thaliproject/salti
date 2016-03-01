'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

//path.verb.role
var acl = require('./acl-get-user.js');

describe('acl get user tests - with bad identity', function () {

  var app;
  var router;

  before(function () {
    app = express();
    router = express.Router();
    
    //mocker..
    router.all('*', function (req, res, next) {
      req.connection.pskIdentity = 'public';
      next();
    })
    
    //Norml middleware usage..
    router.all('*', lib(acl));

    //mock handlers
    var handlers = require('./handlers');

    router.get('/', handlers[0]);
    router.post('/', handlers[1]);
    router.put('/', handlers[2]);
    app.use('/', router);

  })

  describe('get put and post', function () {
    it('should throw a 401', function (done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
    it('should throw a 401', function (done) {
      request(app)
        .put('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
    it('should throw a 401', function (done) {
      request(app)
        .post('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
  })
})

describe('acl get user tests - with empty identity', function () {

  var app;
  var router;

  before(function () {
    app = express();
    router = express.Router();
    
    //mocker..
    router.all('*', function (req, res, next) {
      req.connection.pskIdentity = '';
      next();
    })
    
    //Norml middleware usage..
    router.all('*', lib(acl));

    //mock handlers
    var handlers = require('./handlers');

    router.get('/', handlers[0]);
    router.post('/', handlers[1]);
    router.put('/', handlers[2]);
    app.use('/', router);

  })

  describe('get put and post', function () {
    it('should throw a 401', function (done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
    it('should throw a 401', function (done) {
      request(app)
        .put('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
    it('should throw a 401', function (done) {
      request(app)
        .post('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
  })
})



describe('acl get user tests - with good identity', function () {

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

    router.get('/', handlers[0]);
    router.post('/', handlers[1]);
    router.put('/', handlers[2]);
    app.use('/', router);

  })

  describe('get put and post', function () {
    it('shoudl be OK - 200', function (done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('shoudl be OK - 200', function (done) {
      request(app)
        .put('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('shoudl be OK - 200', function (done) {
      request(app)
        .post('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
  })

});
