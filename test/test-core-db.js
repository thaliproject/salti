'use strict';

/* 
* this will check the following:
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

function genericHandlers(router) {
  var handlers = require('./handlers2');
  router.get('/', handlers.get);
  router.post('/', handlers.post);
  router.put('/', handlers.put);
  return router;
}

describe('some parm checking', function() {
  it('should throw exception', function(done) {
    assert.throws(function() {
      var tv = lib([]);
    });
    done();

  })
  it('should throw exception', function(done) {
    assert.throws(function() {
      var tv = lib('foobar', 'notarray');
    });
    done();

  })
  it('should NOT throw exception', function(done) {
    var tv = lib('foobar', ['foo', 'bar']);
    done();

  })
})

describe('should let all through', function() {
  describe(' - simple check with NO acl - no identity', function() {
    var app, router; app = express(); router = express.Router();

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        //req.connection.pskIdentity = 'public';//not adding any identity for faking.
        next();
      })
      //Norml middleware usage..
      //router.all('*', lib([{}]));
      //mock handlers  
      app.use('/', genericHandlers(router));
    })
    it('should be 200', function(done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(200, done);
    })
  })
})
