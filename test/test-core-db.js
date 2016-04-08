'use strict';

/** this will check the following:
  ** DB spedific paths - note that ':db' token to be substituted with the db name in that context
     * | /:db                   | GET                     | info |     
*/

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

function genericHandlers(router, dbname) {
  var handlers = require('./handlers2');
  router.get('/' + dbname, handlers.get);
  router.post('/' + dbname, handlers.post);
  router.put('/' + dbname, handlers.put);
  router.head('/' + dbname, handlers.head);
  router.options('/' + dbname, handlers.options);
  return router;
}

describe('test-core-db.js - calling the /db path', function() {
  describe('using repl identity', function() {
    var app, router; app = express(); router = express.Router();
    var dbName = 'foobar';

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'repl';
        next();
      })
      //Norml middleware usage..
      var acl = require('./acl-block.1.js');
      router.all('*', lib('foobar', acl,  function(){}));
      //mock handlers  
      app.use('/', genericHandlers(router, dbName));
    })

    it('GET should be 200', function(done) {
      request(app)
        .get('/' + dbName)
        .set('Accept', 'application/json')
        .expect(200, done);
    })
    it('PUT should be 401', function(done) {
      request(app)
        .put('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    it('POST should be 401', function(done) {
      request(app)
        .post('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    it('HEAD should be 401', function(done) {
      request(app)
        .head('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    it('OPTION should be 401', function(done) {
      request(app)
        .options('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })

  })
})


describe('test-core-db.js - calling the /WRONG db path', function() {
  describe('using repl identity', function() {
    var app, router; app = express(); router = express.Router();
    var dbName = 'foobarbad';
    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'repl';
        next();
      })
      //Norml middleware usage..
      var acl = require('./acl-block.1.js');
      router.all('*', lib('foobar', acl, function(){}));
      //mock handlers  
      app.use('/', genericHandlers(router, dbName));
    })
    it('GET should be 401', function(done) {
      request(app)
        .get('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    it('PUT should be 401', function(done) {
      request(app)
        .put('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    it('POST should be 401', function(done) {
      request(app)
        .post('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    it('HEAD should be 401', function(done) {
      request(app)
        .head('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    it('OPTION should be 401', function(done) {
      request(app)
        .options('/' + dbName)
        .set('Accept', 'application/json')
        .expect(401, done);
    })

  })
})
