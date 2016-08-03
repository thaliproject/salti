'use strict';

var request = require('supertest');
var express = require('express');
var path = require('path');
var colors = require('colors');
var assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

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
