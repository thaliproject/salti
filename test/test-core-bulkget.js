'use strict';

/**
 *   * | /:db/_bulk_get              | GET                     | get |
 */

var request = require('supertest');
var express = require('express');
var colors = require('colors');
var assert = require('assert');

var handlers = require('./handlers2');
var lib = require('../lib/index');
var acl = require('./acl-block.1.js');

var dbName = 'foobar';
var path = '/' + dbName + '/_bulk_get';

function genericHandlers(router, path) {
  router.post(path, handlers.get);
  return router;
}

describe('test-core-bulk-get - calling the /db/id path', function () {
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

    it('POST should be 200', function (done) {
      request(app)
        .post(path)
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('GET should be 401', function (done) {
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    it('GET should be 401 added path', function (done) {
      request(app)
        .get(path + '/1234/1234')
        .set('Accept', 'application/json')
        .expect(401, done);
    });
  });
});
