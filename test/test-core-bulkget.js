
/**
 *   * | /:db/_bulk_get              | GET                     | get |
 */


var request = require('supertest'),
  express = require('express'),
  fspath = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(fspath.join(__dirname, '../lib/index'));
var dbName = 'foobar';
var path = '/' + dbName + '/_bulk_get';

function genericHandlers(router, path) {
  var handlers = require('./handlers2');
  router.post(path, handlers.get);
  return router;
}

describe('test-core-bulk-get - calling the /db/id path', function() {
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

    it('POST should be 200', function(done) {
      request(app)
        .post(path)
        .set('Accept', 'application/json')
        .expect(200, done);
    })
   
    it('GET should be 401', function(done) {
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .expect(401, done);
    })
    it('GET should be 401 added path', function(done) {
      request(app)
        .get(path + '/1234/1234')
        .set('Accept', 'application/json')
        .expect(401, done);
    })
  })
})
