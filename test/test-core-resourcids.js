
/**
 *   * | /:db/:id               | GET                     | get |
     * | /:db/:id/attachment    | GET                     | get & getAttachment |
     * | /:db/_local/thali_:id  | GET, PUT, DELETE        | get, put, remove |
 */


var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));
var dbName = 'foobar';
var path = '/' + dbName + '/_all_docs';

function genericHandlers(router, path) {
  var handlers = require('./handlers2');
  router.get('/' + dbName + '/1234', handlers.get);
  return router;
}

describe('test-core-resourceids - calling the /db/id path', function() {
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
        .get('/' + dbName + '/1234')
        .set('Accept', 'application/json')
        .expect(200, done);
    })
    it('GET should be 401', function(done) {
      request(app)
        .get('/' + dbName + '/1234/1234')
        .set('Accept', 'application/json')
        .expect(401, done);
    })

  })
})

