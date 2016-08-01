'use strict';

var request = require('supertest'),
  express = require('express'),
  fspath = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(fspath.join(__dirname, '../lib/index'));

function genericHandlers(router) {
  var handlers = require('./handlers2');
  router.get('*', handlers.get);
  return router;
}

var acl = [{
  'role': 'user',
  'paths': [
    {
      'path': '/{:db}/_local/{:id}',
      'verbs': ['GET']
    },
    {
      'path': '/{:db}/_local/thali_{:id}',
      'verbs': ['GET']
    }
  ]
}];

describe('test-thali-callback.js - should let all through', function() {
  describe('req should be passed to callback', function() {
    var app = express();
    var router = express.Router();
    
    before(function() {
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'user';
        next();
      });
      router.all('*', lib('foobar', acl, function(thaliId, req) {
        return thaliId == 'xx' && req.connection.pskRole === 'user';
      }));
      app.use('/', genericHandlers(router));
    });
    it('/foobar/_local/xx should be 200', function(done) {
      request(app)
        .get('/foobar/_local/xx')
        .expect(200, done);
    });
    it('/foobar/_local/thali_xx should be 200', function(done) {
      request(app)
        .get('/foobar/_local/thali_xx')
        .expect(200, done);
    });
  });
});
