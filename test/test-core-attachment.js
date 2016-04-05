'use strict';

/** this will check the following:
  ** DB spedific paths - note that ':db' token to be substituted with the db name in that context
    ** | /:db/:id/attachment        | GET,     | |
*/

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));
var dbName = 'foobar';
var path = '/' + dbName + '/1234/attachment';

function genericHandlers(router, path) {
  var handlers = require('./handlers2');
  router.get(path, handlers.get);
  return router;
}

describe('test-core-attachment.js - calling the /db/id/attachment path', function() {
  describe('using repl identity', function() {
    var app, router; app = express(); router = express.Router();

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        req.connection.pskRole = 'repl';
        next();
      })
      //Norml middleware usage..0
      var acl = require('./acl-block.1.js');
      router.all('*', lib('foobar', acl));
      //mock handlers  
      app.use('/', genericHandlers(router, path));
    })

    it('GET should be 200', function(done) {
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .expect(200, done);
    })
    
    it('POST should be 401', function(done) {
      request(app)
        .post(path)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    
    it('PUT should be 401', function(done) {
      request(app)
        .put(path)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    
    
    it('GET /zzz should be 401', function(done) {
      request(app)
        .get(path + '/zzz')
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    
    it('GET /zzz/ should be 401', function(done) {
      request(app)
        .get(path + '/zzz/')
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    
    it('GET zzz should be 401', function(done) {
      request(app)
        .get(path + 'zzz')
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    
  })
})
