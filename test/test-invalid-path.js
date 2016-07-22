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
      'path': '/a',
      'verbs': ['GET']
    },
    {
      'path': '/a/b',
      'verbs': ['GET']
    }
  ]
}];

describe('test-invalid-url.js - should let all through', function() {
  describe('no leading slash', function() {
    var app = express();
    var router = express.Router();
    
    // Supertest doesn't like invalid urls without leading slash.
    // This can be fixed by stripping leading slash in first route filter.
    
    before(function() {
      router.all('*', function(req, res, next) {
        // stripping leading slash
        if (req.url.length > 0 && req.url[0] === '/') {
          // req.url will change req.path in the next route (acl).
          req.url = req.url.slice(1);
        }
        req.connection.pskRole = 'user';
        next();
      });
      router.all('*', lib('foobar', acl, function() {}));
      app.use('/', genericHandlers(router));
    });
    it('a should be 401', function(done) {
      request(app)
        .get('/a')
        .expect(401, done);
    });
    it('a/b should be 401', function(done) {
      request(app)
        .get('/a/b')
        .expect(401, done);
    });
  })
})
