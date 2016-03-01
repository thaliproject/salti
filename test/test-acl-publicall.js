'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

//path.verb.role
var acl = require('./acl-get-multipleusers.js');

describe('acl public get all; user just get', function () {

  var app;
  var router;

  before(function () {
    app = express();
    router = express.Router();
    
    //mocker..
    router.all('*', function (req, res, next) {
      req.headers.identity = 'public';
      next();
    })
    
    //Norml middleware usage..
    router.all('*', lib(acl));

    //mock handlers
    var handlers = require('./handlers');

    router.get('/publicall', handlers[0]);
    router.post('/publicall', handlers[1]);
    router.put('/publicall', handlers[2]);
    app.use('/', router);

  })

    describe('publicall verbs', function () {
    it('shoudl be OK - 200', function (done) {
      request(app)
        .get('/publicall')
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('shoudl be OK - 200', function (done) {
      request(app)
        .put('/publicall')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
    it('shoudl be OK - 200', function (done) {
      request(app)
        .post('/publicall')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
      // .set('Identity', 'user')
        .expect(200, done);
    })
  })

})

