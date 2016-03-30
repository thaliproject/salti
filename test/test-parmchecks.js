'use strict';

/** This will do some basic parm checking */

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
  it('should throw exception if just 1 parm or arg1 is not a string', function(done) {
    assert.throws(function() {
      var tv = lib([]);
    });
    done();

  })
  it('should throw exception when 2nd parm is not an array', function(done) {
    assert.throws(function() {
      var tv = lib('foobar', 'notarray');
    });
    done();

  })
  it('should NOT throw exception as parm 1 is string parm 2 is array', function(done) {
    var tv = lib('foobar', ['foo', 'bar']);
    done();

  })
})
