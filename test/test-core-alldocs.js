'use strict';

/** this will check the following:
  ** DB spedific paths - note that ':db' token to be substituted with the db name in that context
    ** | /:db/_all_docs         | GET, HEAD, POST [1]     | allDocs |
*/

var request = require('supertest');
var express = require('express');
var colors = require('colors');
var assert = require('assert');

var handlers = require('./handlers2');
var lib = require('../lib/index');
var acl = require('./acl-block.1.js');

var dbName = 'foobar';
var path = '/' + dbName + '/_all_docs';

function genericHandlers(router, path) {
  router.get(path, handlers.get);
  router.post(path, handlers.post);
  router.put(path, handlers.put);
  router.head(path, handlers.head);
  router.options(path, handlers.options);
  return router;
}

describe('test-core-db-2.js - calling the /db path', function () {
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

    it('GET should be 200', function (done) {
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it('PUT should be 401', function (done) {
      request(app)
        .put(path)
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    it('POST should be 200', function (done) {
      request(app)
        .post(path)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it('HEAD should be 200', function (done) {
      request(app)
        .head(path)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it('OPTION should be 401', function (done) {
      request(app)
        .options(path)
        .set('Accept', 'application/json')
        .expect(401, done);
    });
  });
});
