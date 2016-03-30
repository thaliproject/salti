'use strict';

/** this will check the following:
  ** DB spedific paths - note that ':db' token to be substituted with the db name in that context
     * | /:db                   | GET                     | info |     
    ** | /:db/_all_docs         | GET, HEAD, POST [1]     | allDocs |
    ** | /:db/_changes          | GET, POST [2]           | changes |
     * | /:db/_bulk_get         | POST                    | bulkGet |
     * | /:db/_revs_diff        | POST                    | revsDiff |
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
      router.all('*', lib('foobar', acl ));
      //mock handlers  
      app.use('/', genericHandlers(router, dbName));
    })
    it('should be 200', function(done) {
      request(app)
        .get('/' + dbName)
        .set('Accept', 'application/json')
        .expect(200, done);
    })
    it('should be 401', function(done) {
      request(app)
        .get('/notfoobar')
        .set('Accept', 'application/json')
        .expect(401, done);
    })
  })
})
