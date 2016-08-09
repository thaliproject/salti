'use strict';

/**
     * | /:db/:id  | GET, PUT, DELETE        | get, put, remove |
 */

var request = require('supertest');
var express = require('express');
var colors = require('colors');
var assert = require('assert');

var handlers = require('./handlers2');
var lib = require('../lib/index');
var acl = require('./acl-block.1.js');

var dbName = 'foobar';
var path = dbName + '/1234';

function genericHandlers(router) {
  router.get('/' + path, handlers.get);
  router.get('/', handlers.get);
  return router;
}

describe('test-core-resources - just the /', function () {
  var app = express();
  var router = express.Router();

  before(function () {
    // mocker..
    router.all('*', function (req, res, next) {
      req.connection.pskRole = 'repl';
      next();
    });
    // Norml middleware usage..0
    router.all('*', lib('foobar', acl, function (){}));
    // mock handlers
    app.use('/', genericHandlers(router, path));
  });

  it('should be OK', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});

describe('test-core-resources calling the /db/{id} path', function () {
  describe('using repl identity', function () {
    var app, router;
    var app = express();
    var router = express.Router();

    before(function () {
      // mocker..
      router.all('*', function (req, res, next) {
        req.connection.pskRole = 'repl';
        next();
      });
      // Norml middleware usage..0
      router.all('*', lib('foobar', acl, function (){}));
      // mock handlers
      app.use('/', genericHandlers(router, path));
    });

    it('GET should be 200 ' + '/' + path, function (done) {
      request(app)
        .get('/' + path)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it('PUT should be 401', function (done) {
      request(app)
        .put('/' + path)
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    it('DELETE should be 401', function (done) {
      request(app)
        .delete('/' + path)
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    it('POST should be 401', function (done) {
      request(app)
        .post('/' + path)
        .set('Accept', 'application/json')
        .expect(401, done);
    });

    it('GET should be 401 on /1234/1234', function (done) {
      request(app)
        .get('/' + path + '/1234')
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    it('PUT should be 401', function (done) {
      request(app)
        .put('/' + path + '/1234')
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    it('DELETE should be 401', function (done) {
      request(app)
        .delete('/' + path + '/1234')
        .set('Accept', 'application/json')
        .expect(401, done);
    });
  });
});
