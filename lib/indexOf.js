'use strict';

/**
 * Simple compare.
 * @module indexOf
 */
function compareIt(source, target) {
  return source === target;
}

/**
 * Does an indexOf from a array/object against a target and optional key
 * @param {Object} subject - the source array or object.
 * @param {string} target - the value to lookup.
 * @param {string} key - an optional property value to use if using an object as subject
 * @returns {Number} the index value where found or -1 if not found
 */
module.exports.indexOf = function fastIndexOf(subject, target, key) {
  var length = subject.length;
  var i = 0;

  if (key) {
    for (; i < length; i++) {
      if (compareIt(subject[i][key], target)) {
        return i;
      }
    }
  }
  else {
    for (; i < length; i++) {
      if (compareIt(subject[i], target)) {
        return i;
      }
    }
  }
  return -1;
};

