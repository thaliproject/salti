'use strict';

/**
     * | /:db/_local/:id  | GET, PUT, DELETE        | get, put, remove |
 */


var request = require('supertest');
var express = require('express');
var colors = require('colors');
var assert = require('assert');

var handlers = require('./handlers2');
var lib = require('../lib/index');
var acl = require('./acl-block.1.js');

var dbName = 'foobar';
var path = dbName + '/_local/1234';

function genericHandlers(router, path) {
  router.get('/' + path, handlers.get);
  router.put('/' + path, handlers.put);
  router.delete('/' + path, handlers.delete);
  return router;
}

describe('test-core- LOCAL - calling the /db/_local/{id} path', function () {
  describe('using repl identity', function () {
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
    it('PUT should be 200', function (done) {
      request(app)
        .put('/' + path)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it('DELETE should be 200', function (done) {
      request(app)
        .delete('/' + path)
        .set('Accept', 'application/json')
        .expect(200, done);
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
