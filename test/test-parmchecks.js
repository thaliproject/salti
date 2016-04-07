'use strict';

/** This will do some basic parm checking */

var assert = require('assert'),
    fspath = require('path');

var lib = require(fspath.join(__dirname, '../lib/index'));

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
