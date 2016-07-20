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
    },
    {
      'path': '/bar/',
      'verbs': ['GET']
    }
  ]
}];

describe('test-trailing-slash.js - should let all through', function() {
  describe('strip trailing slash - true', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'user';
        next();
      })
      router.all('*', lib('foobar', acl, function(){}, { stripTrailingSlash: true }));
      app.use('/', genericHandlers(router));
    })
    it('/ should be 200', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    })
    it('/\/ should be 200', function(done) {
      request(app)
        .get('/\/')
        .expect(200, done);
    })
    it('/foo should be 200', function(done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    })
    it('/foo/ should be 200', function(done) {
      request(app)
        .get('/foo/')
        .expect(200, done);
    })
    it('/bar should be 401', function(done) {
      request(app)
        .get('/bar')
        .expect(401, done);
    })
    it('/bar/ should be 401', function(done) {
      request(app)
        .get('/bar/')
        .expect(401, done);
    })
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
      router.all('*', lib('foobar', acl, function(){}, { stripTrailingSlash: false }));
      app.use('/', genericHandlers(router));
    })
    it('/ should be 200', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    })
    it('/\/ should be 401', function(done) {
      request(app)
        .get('/\/')
        .expect(401, done);
    })
    it('/foo should be 200', function(done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    })
    it('/foo/ should be 401', function(done) {
      request(app)
        .get('/foo/')
        .expect(401, done);
    })
    it('/bar should be 401', function(done) {
      request(app)
        .get('/bar')
        .expect(401, done);
    })
    it('/bar/ should be 200', function(done) {
      request(app)
        .get('/bar/')
        .expect(200, done);
    })
  });
});
