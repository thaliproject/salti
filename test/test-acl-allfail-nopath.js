'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

//path.verb.role
var acl = require('./acl-get-multipleusers.js');

describe('no paths OK all should fail', function () {

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

    router.get('/', handlers[0]);
    router.post('/', handlers[1]);
    router.put('/', handlers[2]);
    app.use('/', router);

  })

  describe('should throw a 401', function () {
    it('when no path exists', function (done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
    it('when no path exists', function (done) {
      request(app)
        .put('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
    it('when no path exists', function (done) {
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
      req.headers.identity = '';
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

  describe('should throw a 401', function () {
    it('when no path exists', function (done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
    it('when no path exists', function (done) {
      request(app)
        .put('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'public')
        .expect(401, done);
    })
    it('when no path exists', function (done) {
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
      req.headers.identity = 'user';
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

  describe('should throw a 401', function () {
    it('when no path exists', function (done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(401, done);
    })
    it('when no path exists', function (done) {
      request(app)
        .put('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(401, done);
    })
    it('when no path exists', function (done) {
      request(app)
        .post('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(401, done);
    })
  })

});
