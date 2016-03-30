'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

function genericHandlers(router) {
  var handlers = require('./handlers2');
  router.get('/', handlers.get);
  router.post('/', handlers.post);
  router.put('/', handlers.put);
  return router;
}

/**
 * we define 2 distinct 'roles' (other than Admin)
 * 1. Pull Replication
 * 2. Beacon  - using a well-known PSK identity of beacon
 * All other requests are non-authenticated and purely anonymous are rejected.
 */
describe('should let all through', function() {
  describe(' - simple check with NO acl - no identity', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        //req.connection.pskIdentity = 'public';//not adding any identity for faking.
        next();
      })
      //Norml middleware usage..
      //router.all('*', lib([{}]));
      //mock handlers  
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
      //mocker..
      router.all('*', function(req, res, next) {
        req.connection.pskIdentity = 'public';
        next();
      })
      //Norml middleware usage..
      router.all('*', lib('foobar', [{}]));
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
      router.all('*', lib('foobar', [{}]));
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