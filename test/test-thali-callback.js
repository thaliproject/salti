'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');


var lib = require(path.join(__dirname, '../lib/index'));
var dbName = 'foobar';
var pathPrefix = '/' + dbName + '/_local/thali__ID_';

var validId = 'zz-xx--bb';


function verifyThaliUser(idToCheck) {
  console.log(colors.green('checking ID: %s'), idToCheck);
  return validId === idToCheck;
}

function genericHandlers(router, path) {
  var handlers = require('./handlers2');
  router.get(path, handlers.get);
  router.post(path, handlers.post);
  router.put(path, handlers.put);
  router.head(path, handlers.head);
  router.options(path, handlers.options);
  router.delete(path, handlers.options);
  return router;
}

describe('We are validating requests that look like /db/_local/thali_:ID', function() {
  describe('if the request is ../thali_ and nothing', function(done) {
    var app, router; app = express(); router = express.Router();

    var rootPath = '/' + dbName + '/_local/thali_';
    var pathWithId = rootPath + validId;

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'repl';
        next();
      })
      //Norml middleware usage..0
      var acl = require('./acl-block.1.js');
      router.all('*', lib('foobar', acl, verifyThaliUser));
      //mock handlers
      app.use('/', genericHandlers(router, pathWithId));
    });

    /** mapped paths mix of verbs */
    it('GET should be OK - we are using ' + validId, function(done) {
      request(app)
        .get(pathWithId)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it('GET should fail as it does not match valid ID ' + rootPath + 'zzz', function(done) {
      request(app)
        .get(rootPath + 'zzz')
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    it('GET should fail as it does not match valid ID ' + rootPath, function(done) {
      request(app)
        .get(rootPath)
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    it('PUT should be OK - we are using ' + validId, function(done) {
      request(app)
        .put(pathWithId)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it('DELETE should be OK - we are using ' + validId, function(done) {
      request(app)
        .delete(pathWithId)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it('POST should fail no acl for verb  - we are using ' + validId, function(done) {
      request(app)
        .post(pathWithId)
        .set('Accept', 'application/json')
        .expect(401, done);
    });

    /** unmapped paths */
    it('should fail with a 401 as not valid', function(done) {
      request(app)
        .get(rootPath)
        .set('Accept', 'application/json')
        .expect(401, done);
    });
    
    it('should OK as full path', function(done) {
      request(app)
        .get(pathWithId)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });
  describe('req should be passed to callback', function() {
    var app = express();
    var router = express.Router();
    
    before(function() {
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'repl';
        next();
      });
      var acl = require('./acl-block.1.js');
      router.all('*', lib('foobar', acl, function(thaliId, req) {
        return thaliId == 'xx' && req.connection.pskRole === 'repl';
      }));
      app.use('/', genericHandlers(router, '*'));
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
