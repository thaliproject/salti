'use strict';

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

/**
 * we define 2 distinct 'roles' (other than Admin)
 * 1. Pull Replication
 * 2. Beacon  - using a well-known PSK identity of beacon
 * All other requests are non-authenticated and purely anonymous are rejected.
 */
describe('should let all through', function() {
  describe(' - simple check with NO acl - no identity', function() {
    var app, router;
    app = express();
    router = express.Router();

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
  describe('simple check with empty acl - public identity', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        req.connection.pskIdentity = 'public';
        next();
      })
      //Norml middleware usage..
      router.all('*', lib([{}]));
      //mock handlers  
      app.use('/', genericHandlers(router));
    })
    it('should be 401', function(done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(401, done);
    })
  })
  describe('simple check with empty - user', function() {
    var app, router;
    app = express();
    router = express.Router();

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        req.connection.pskIdentity = 'user';
        next();
      })
      //Norml middleware usage..
      router.all('*', lib([{}]));
      //mock handlers  
      app.use('/', genericHandlers(router));
    })
    it('should be 401', function(done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(401, done);
    })
  })
})

//TODO:
describe('block.1 - for all roles and users - if the request is just a /', function() {
  var app;
  var router;

  app = express();
  router = express.Router();

  before(function() {
    //mocker..
    router.all('*', function(req, res, next) {
      req.connection.pskIdentity = 'public';
      next();
    })
    //Norml middleware usage..
     
    var acl = require('./acl-block.1.js');

    router.all('*', lib(acl));
    //mock handlers  
    app.use('/', genericHandlers(router));
  })

  it('should be 401 - unauthorized - no user', function(done) {
    request(app)
      .get('/')
      .send({ email: 'test@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(401, done);
  })

  it('should be 401 - unauthorized - user', function(done) {
    request(app)
      .get('/')
      .send({ email: 'test@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(401, done);
  })
  it('should be 401 - unauthorized - public', function(done) {
    request(app)
      .get('/')
      .send({ email: 'test@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(401, done);
  })
})

describe('block.2 - just a dummy sanity check - if the request is just a /', function() {
  var app;
  var router;

  app = express();
  router = express.Router();
  before(function() {
    //mocker..
    router.all('*', function(req, res, next) {
      //req.connection.pskIdentity = 'public';
      next();
    })
    //Norml middleware usage..
     
    var acl = [{
        "path": "/",
        "roles": [
          {"role": "public",
            "verbs": []},
          {"role": "user",
            "verbs": ["POST", "PUT", "GET", "GET", "PUT", "POST"]}
        ]
      }];
        
    router.all('*', lib(acl));
    //mock handlers  
    app.use('/', genericHandlers(router));
  })

  it('dummy should be 200 - no user', function(done) {
    request(app)
      .get('/')
      .send({ email: 'test@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(401, done);
  })

})
//TODO:
describe('when the user is pskIdentity = beacon', function() {
  describe('and he requests any path other than the "beacon" path', function() {
    //todo: what is the beacon path
    it('POST/GET/PUT should fail with a 401', function() {

    })
    it('IF a GET should be OK 200', function() {

    })
  })

  describe('if the user is in the Anymous role', function() {
    /**
     * Anonymous Role - NO CLEAR header or any user/identity..
     */
    it('should deny all requests', function() {

    })
  })

})

//TODO: Bulk of work
describe('when the users is in the Thali_Pull_Replication role', function() {
  describe('When the Database name is "foobar".', function() {
    describe('for the following paths and verbs', function() {
      //passing
      //  /:db  GET
      //fail
      //  /:db PUT, POST, HEAD
      it('should allow GET /:db', function() {

      })
      it('should FAIL PUT, POST, HEAD', function() {

      })

      //passing
      //  /:db/_all_docs  GET, HEAD, POST
      //fail
      //  /:db/_all_docs  PUT, OPTIONS

      //passing
      //  /:db/_changes  GET, POST
      //fail
      //  /:db/_changes  PUT, HEAD, OPTIONS

      //passing
      //  /:db/_bulk_get  POST
      //fail
      //  /:db/_bulk_get  GET, PUT, HEAD, OPTIONS

      //passing
      //  /:db/_revs_diff  POST
      //fail
      //  /:db/_revs_diff  GET, PUT, HEAD, OPTIONS

      //passing
      //  /:db/:id   GET
      //fail
      //  /:db/:id  POST, PUT, HEAD, OPTIONS

      //passing
      //  /:db/:id/attachment   GET
      //fail
      //  /:db/:id/attachment  POST, PUT, HEAD, OPTIONS

      //passing
      //  /:db/_local/thali_:id   GET, PUT, DELETE
      //fail
      //  /:db/_local/thali_:id  POST, HEAD, OPTIONS

      //passing
      //  /:db/_local/:id   GET, PUT, DELETE
      //fail
      //  /:db/_local/:id  POST, HEAD, OPTIONS


    })
    describe('and the DB name and parameter is :db == foobar', function() {
      describe('and the request path IS NOT /foobar', function() {
        it('should not allow /fuzbar', function() {

        })
        it('should not allow /fuzbar/', function() {

        })
        it('should not allow /fuzbar/1', function() {

        })
      })

      describe('and the request path IS /foobar', function() {
        it('should allow GET /foobar', function() {

        })
        it('should allow GET /foobar/', function() {

        })
        it('should allow GET /foobar/1', function() {

        })
        it('should allow GET /foobar/a', function() {

        })
        it('should allow GET /foobar/a/attachment', function() {

        })
        it('should NOT allow PUT, POST /foobar', function() {

        })
        it('should NOT allow PUT, POST /foobar/', function() {

        })
        it('should NOT allow PUT, POST  /foobar/1', function() {

        })
        it('should NOT allow PUT, POST  /foobar/a', function() {

        })
        it('should NOT allow PUT, POST  /foobar/a/attachment', function() {

        })
      })
    })

  })

})


