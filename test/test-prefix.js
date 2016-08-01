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
      'path': '/',
      'verbs': ['GET']
    },
    {
      'path': '/foo',
      'verbs': ['GET']
    }
  ]
}];

describe('test-prefix.js - should let all through', function() {
  describe('strip prefix - true', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'user';
        next();
      });
      router.all(
        '*',
        lib('foobar', acl, function(){}, {
          prefix: '/fit'
        })
      );
      app.use('/', genericHandlers(router));
    });
    it('/ should be 200', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
    it('/fit/ should be 200', function(done) {
      request(app)
        .get('/fit/')
        .expect(200, done);
    });
    it('/foo should be 200', function(done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    });
    it('/fit/foo should be 200', function(done) {
      request(app)
        .get('/fit/foo')
        .expect(200, done);
    });
  });
  describe('strip trailing slash - false', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'user';
        next();
      })
      router.all(
        '*',
        lib('foobar', acl, function(){}, {
          prefix: undefined
        })
      );
      app.use('/', genericHandlers(router));
    });
    it('/ should be 200', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
    it('/fit/ should be 401', function(done) {
      request(app)
        .get('/fit/')
        .expect(401, done);
    });
    it('/foo should be 200', function(done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    });
    it('/fit/foo should be 401', function(done) {
      request(app)
        .get('/fit/foo')
        .expect(401, done);
    });
  });
});
