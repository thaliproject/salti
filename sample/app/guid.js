'use strict';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

if (typeof module != 'undefined') {
  module.exports = guid;
}
if (typeof angular != 'undefined') {
  angular.module('myApp').constant('$guid', guid);
}
