'use strict';

var request = require('supertest'),
  express = require('express'),
  fspath = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(fspath.join(__dirname, '../lib/index'));

function genericHandlers(router) {
  var handlers = require('./handlers2');
  router.get('/', handlers.get);
  router.post('/', handlers.post);
  router.put('/', handlers.put);
  return router;
}

describe('test-noaclfile.js - should let all through', function() {
  describe(' - simple check with NO acl - no identity', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      router.all('*', function(req, res, next) {
        next();
      })
 
      app.use('/', genericHandlers(router));
    })
    it('should be 200', function(done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(200, done);
    })
  })
  describe('simple check with empty acl - public identity', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      router.all('*', function(req, res, next) {
        req.connection.pskIdentity = 'public';
        next();
      })
      router.all('*', lib('foobar', [{}],  function(){}));
      app.use('/', genericHandlers(router));
    })
    it('should be 401', function(done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(401, done);
    })
  })
  describe('simple check with empty - user', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        req.connection.pskIdentity = 'user';
        next();
      })
      //Norml middleware usage..
      router.all('*', lib('foobar', [{}], function(){}));
      //mock handlers  
      app.use('/', genericHandlers(router));
    })
    it('should be 401', function(done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(401, done);
    })
  })
})