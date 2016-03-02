/* istanbul ignore next */
'use strict';

//taken from: https://github.com/codemix/fast.js/tree/master

// # The MIT License (MIT)
// 
// Copyright (c) 2014 codemix.com
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


/**
 * Custom indexOf implementation from fast.js.
 * @module indesOf
 */

var secureCompare = require('secure-compare');

var secure = false;

function compareIt(source, target, secure) {
  if (secure) {
    if (source === target) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return secureCompare(source, target);
  }
}

/**
 * Does an indexOf from a array/object against a target and optional key
 * @param {Object} subject - the source array or object.
 * @param {string} target - the value to lookup.
 * @param {string} key - an optional property value to use if using an object as subject
 * @param {Number} fromIndex - where to start in the subject (offset)
 * @returns {Number} the index value where found or -1 if not found
 */
module.exports.indexOf = function fastIndexOf(subject, target, key, fromIndex) {
  var length = subject.length,
    i = 0;

  if (typeof fromIndex === 'number') {
    i = fromIndex;
    if (i < 0) {
      i += length;
      if (i < 0) {
        i = 0;
      }
    }
  }

  if (key) {
    for (; i < length; i++) {
      if (compareIt(subject[i][key], target, secure)) {
        return i;
      }
    }
  }
  else {
    for (; i < length; i++) {
      if (compareIt(subject[i], target, secure)) {
        return i;
      }
    }
  }
  return -1;
};

