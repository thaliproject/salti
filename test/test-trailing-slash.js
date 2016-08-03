'use strict';

var request = require('supertest');
var express = require('express');
var colors = require('colors');
var assert = require('assert');

var handlers = require('./handlers2');
var lib = require('../lib/index');

function genericHandlers(router) {
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

describe('test-trailing-slash.js - should let all through', function () {
  describe('strip trailing slash - true', function () {
    var app = express();
    var router = express.Router();

    before(function () {
      router.all('*', function (req, res, next) {
        req.connection.pskRole = 'user';
        next();
      });
      router.all(
        '*',
        lib('foobar', acl, function (){}, {
          stripTrailingSlash: true
        })
      );
      app.use('/', genericHandlers(router));
    });
    it('/ should be 200', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
    it('/\/ should be 200', function (done) {
      request(app)
        .get('/\/')
        .expect(200, done);
    });
    it('/%2F should be 401', function (done) {
      request(app)
        .get('/%2F')
        .expect(401, done);
    });
    it('/foo should be 200', function (done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    });
    it('/foo/ should be 200', function (done) {
      request(app)
        .get('/foo/')
        .expect(200, done);
    });
    it('/foo%2F should be 401', function (done) {
      request(app)
        .get('/foo%2F')
        .expect(401, done);
    });
    it('/bar should be 401', function (done) {
      request(app)
        .get('/bar')
        .expect(401, done);
    });
    it('/bar/ should be 401', function (done) {
      request(app)
        .get('/bar/')
        .expect(401, done);
    });
    it('/bar%2F should be 401', function (done) {
      request(app)
        .get('/bar%2F')
        .expect(401, done);
    });
  });
  describe('strip trailing slash - false', function () {
    var app = express();
    var router = express.Router();

    before(function () {
      router.all('*', function (req, res, next) {
        req.connection.pskRole = 'user';
        next();
      });
      router.all(
        '*',
        lib('foobar', acl, function (){}, {
          stripTrailingSlash: false
        })
      );
      app.use('/', genericHandlers(router));
    });
    it('/ should be 200', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
    it('/\/ should be 401', function (done) {
      request(app)
        .get('/\/')
        .expect(401, done);
    });
    it('/%2F should be 401', function (done) {
      request(app)
        .get('/%2F')
        .expect(401, done);
    });
    it('/foo should be 200', function (done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    });
    it('/foo/ should be 401', function (done) {
      request(app)
        .get('/foo/')
        .expect(401, done);
    });
    it('/foo%2F should be 401', function (done) {
      request(app)
        .get('/foo%2F')
        .expect(401, done);
    });
    it('/bar should be 401', function (done) {
      request(app)
        .get('/bar')
        .expect(401, done);
    });
    it('/bar/ should be 200', function (done) {
      request(app)
        .get('/bar/')
        .expect(200, done);
    });
    it('/bar%2F should be 401', function (done) {
      request(app)
        .get('/bar%2F')
        .expect(401, done);
    });
  });
});
