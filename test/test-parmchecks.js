'use strict';

/** This will do some basic parm checking */

var assert = require('assert');

var lib = require('../lib/index');

describe('some parm checking', function () {
  it(
    'should throw exception if just 1 parm or arg1 is not a string',
    function (done) {
      assert.throws(function () {
        var tv = lib([]);
      });
      done();
    }
  );
  it('should throw exception when 2nd parm is not valid acl', function (done) {
    assert.throws(function () {
      var tv = lib('foobar', 'notarray', function (){});
    });
    done();
  });
  it(
    'should NOT throw exception as parm 1 is string parm 2 is valid acl',
    function (done) {
      var tv = lib('foobar', [{}], function (){});
      done();
    }
  );

  it('should not throw exception as parm 3 is fn', function (done){
    var tv = lib('foobar', [{}], function (){});
    done();
  });

  it('should throw exception as parm 3 is not a fn', function (done){
    assert.throws(function (){
      var tv = lib('foobar', [{}], 'foo');
    });
    done();
  });
});
