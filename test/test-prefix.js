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
      'path': '/{:db}/fit',
      'verbs': ['GET']
    }
  ]
}];

describe('test-prefix.js - should let all through', function () {
  describe('strip prefix - true', function () {
    var app = express();
    var router = express.Router();

    before(function () {
      router.all('*', function (req, res, next) {
        req.connection.pskRole = 'user';
        next();
      });
      router.all('*', lib('foobar', acl, function (){}, {
        prefix: 'prefix'
      }));
      app.use('/', genericHandlers(router));
    });
    it('/ should be 200', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
    it('/prefix/ should be 401', function (done) {
      request(app)
        .get('/prefix/')
        .expect(401, done);
    });
    it('/foo should be 200', function (done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    });
    it('/prefix/foo should be 401', function (done) {
      request(app)
        .get('/prefix/foo')
        .expect(401, done);
    });
    it('/foobar/fit should be 401', function (done) {
      request(app)
        .get('/foobar/fit')
        .expect(401, done);
    });
    it('/prefix/foobar/fit should be 200', function (done) {
      request(app)
        .get('/prefix/foobar/fit')
        .expect(200, done);
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
      router.all('*', lib('foobar', acl, function (){}));
      app.use('/', genericHandlers(router));
    });
    it('/ should be 200', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
    it('/prefix/ should be 401', function (done) {
      request(app)
        .get('/prefix/')
        .expect(401, done);
    });
    it('/foo should be 200', function (done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    });
    it('/prefix/foo should be 401', function (done) {
      request(app)
        .get('/prefix/foo')
        .expect(401, done);
    });
    it('/foobar/fit should be 200', function (done) {
      request(app)
        .get('/foobar/fit')
        .expect(200, done);
    });
    it('/prefix/foobar/fit should be 401', function (done) {
      request(app)
        .get('/prefix/foobar/fit')
        .expect(401, done);
    });
  });
});
