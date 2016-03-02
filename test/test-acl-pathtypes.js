'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path'),
  colors = require('colors'),
  assert = require('assert');

var lib = require(path.join(__dirname, '../lib/index'));

var acl = require('./acl-path-types');


describe('checking for items after a base path', function(){
  
  var app;
  var router;

  before(function () {
    app = express();
    router = express.Router();
    
    //mocker..
    router.all('*', function (req, res, next) {
      req.connection.pskIdentity = 'public';
      next();
    })
    
    //Norml middleware usage..
    router.all('*', lib(acl));

    //mock handlers
    var handlers = require('./handlers');

    router.get('/base', handlers[0]);
    router.get('/base/myfile.js', handlers[0]);
    router.get('/foo', handlers[0]);
    router.get('/bar/foo', handlers[0]);
    router.get('/foo/myfile.js', handlers[0]);
    router.get('/bar/foo/myfile.js', handlers[0]);
    router.get('/fiz/baz', handlers[0]);
    router.get('/fiz/baz/myfile.js', handlers[0]);
    app.use('/', router);

  })
  
  describe('if a path ends in a /', function(){
    it('should allow /base through', function(done){
      request(app)
        .get('/base')
        .set('Accept', 'application/json')
        .expect(200, done)  
    })
    
    it('should allow /base/myfile.js through', function(done){
      request(app)
        .get('/base/myfile.js')
        .set('Accept', 'application/json')
        .expect(200, done)  
    })
    
    it('should stop /basemyfile.js', function(done){
      request(app)
        .get('/basemyfile.js')
        .set('Accept', 'application/json')
        .expect(401, done)        
    })
  })

  describe('if a path doesnt ends in a / - it should assume it', function(){
    it('should allow /foo/ through', function(done){
      request(app)
        .get('/foo/')
        .set('Accept', 'application/json')
        .expect(200, done)        
    })      
    it('should allow /foo/myfile.js through', function(done){
      request(app)
        .get('/foo/myfile.js')
        .set('Accept', 'application/json')
        .expect(200, done)        
    })
    
    it('should stop /foomyfile.js', function(done){
      request(app)
        .get('/foomyfile.js')
        .set('Accept', 'application/json')
        .expect(401, done)        
    })
  })

  describe('if a path ends in a /', function(){
    it('should allow /bar/foo through', function(done){
      request(app)
        .get('/bar/foo')
        .set('Accept', 'application/json')
        .expect(200, done)        
    })
    
    it('should allow /bar/foo/myfile.js through', function(done){
      request(app)
        .get('/bar/foo/myfile.js')
        .set('Accept', 'application/json')
        .expect(200, done)        
    })
    
    it('should stop /bar/foomyfile.js', function(done){
      request(app)
        .get('/bar/foomyfile.js')
        .set('Accept', 'application/json')
        .expect(401, done)        
    })
  })

  describe('if a path doesnt ends in a / - it should assume it', function(){
    it('should allow /fiz/baz/ through', function(done){
      request(app)
        .get('/fiz/baz/')
        .set('Accept', 'application/json')
        .expect(200, done)        
    })
    
    it('should allow /fiz/baz/myfile.js through', function(done){
      request(app)
        .get('/fiz/baz/myfile.js')
        .set('Accept', 'application/json')
        .expect(200, done)        
    })
    
    it('should stop /fiz/bazmyfile.js', function(done){
      request(app)
        .get('/fiz/bazmyfile.js')
        .set('Accept', 'application/json')
        .expect(401, done)        
    })
  })


})