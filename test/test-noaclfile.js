'use strict';

var request = require('supertest');
var express = require('express');
var colors = require('colors');
var assert = require('assert');

var handlers = require('./handlers2');
var lib = require('../lib/index');

function genericHandlers(router) {
  router.get('/', handlers.get);
  router.post('/', handlers.post);
  router.put('/', handlers.put);
  return router;
}

describe('test-noaclfile.js - should let all through', function () {
  describe('simple check with NO acl - no identity', function () {
    var app = express();
    var router = express.Router();

    before(function () {
      router.all('*', function (req, res, next) {
        next();
      });
      app.use('/', genericHandlers(router));
    });
    it('should be 200', function (done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });
  describe('simple check with acl - no identity', function () {
    var app = express();
    var router = express.Router();

    before(function () {
      router.all('*', lib('foobar', [{}],  function (){}));
      app.use('/', genericHandlers(router));
    });
    it('should be 401', function (done) {
      request(app)
        .get('/')
        .expect(401, done);
    });
  });
  describe('simple check with empty acl - public identity', function () {
    var app = express();
    var router = express.Router();

    before(function () {
      router.all('*', function (req, res, next) {
        req.connection.pskRole = 'public';
        next();
      });
      router.all('*', lib('foobar', [{}],  function (){}));
      app.use('/', genericHandlers(router));
    });
    it('should be 401', function (done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(401, done);
    });
  });
  describe('simple check with empty - user', function () {
    var app = express();
    var router = express.Router();

    before(function () {
      // mocker..
      router.all('*', function (req, res, next) {
        req.connection.pskRole = 'user';
        next();
      });
      // Norml middleware usage..
      router.all('*', lib('foobar', [{}], function (){}));
      // mock handlers
      app.use('/', genericHandlers(router));
    });
    it('should be 401', function (done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(401, done);
    });
  });
});
