'use strict';

/** This will do some basic parm checking */

var assert = require('assert'),
    path = require('path');

var lib = require(path.join(__dirname, '../lib/index'));

describe('some parm checking', function() {
  it('should throw exception if just 1 parm or arg1 is not a string', function(done) {
    assert.throws(function() {
      var tv = lib([]);
    });
    done();

  })
  it('should throw exception when 2nd parm is not an array', function(done) {
    assert.throws(function() {
      var tv = lib('foobar', 'notarray', function(){});
    });
    done();

  })
  it('should NOT throw exception as parm 1 is string parm 2 is array', function(done) {
    var tv = lib('foobar', ['foo', 'bar'], function(){});
    done();

  })
  
  it('should not throw exception as parm 3 is fn', function(done){
    var tv = lib('foobar', ['foo'], function(){});
    done();
  })
  
  
  it('should throw exception as parm 3 is fn', function(done){
    assert.throws(function(){
      var tv = lib('foobar', ['foo'], 'foo');  
    })
    done();
  })
  
})
