'use strict';

var debug = require('debug')('thalisalti:acl');
var fast = require('./indexOf');

var anonymous = 'public';
var NOTFOUND = -1;

/**
 * Acl
 * @typedef {Object} Salti.Acl
 * TODO:
 */


/**
 * Implements an Express middleware Authentication Filter
 * that validates an identity provided as a property on the request.connection object
 * against ACL represented as a json object.
 * @param {Salti.Acl} acl - acl represented as an array of path.role.verb
 * @returns {Function} returns a handler of (req, res, next) to the middleware pipeline
 */
module.exports = function (acl) {
  //path.role.verb
  var msg401 = { success: false, message: 'Unauthorized' };

  return function (req, res, next) {
    debug('method: %s url: %s path: %s', req.method, req.url, req.path);
    
    //using headers for validation of the acl engine    
    var identity = req.connection.pskIdentity || anonymous;
    debug('Identity: %s', identity);

    //if the path is just '/' then use that, otherwise, find the path
    //without the trailing '/'
    var path = req.path === '/' ? '/' 
          : req.path.slice(-1) === '/' ? req.path.slice(0, -1) 
              : req.path;
              
    var pathExists = fast.indexOf(acl, path, 'path');

    //here we're looking for an EXACT match as is - with full path and NO resource on the end...
    //ie.  /foobar/myresource.js  - this will fail if /foobar is in the ACL's
 
    if (NOTFOUND === pathExists) {
      debug('unauthorized1: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }

    //roles are an array of objects with properyt of 'role'
    var roles = acl[pathExists].roles;
    var roleExists = fast.indexOf(roles, identity, 'role');
    if (NOTFOUND === roleExists) {
      debug('unauthorized2: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }

    //verbs are just an array of strings
    var verbs = roles[roleExists].verbs;
    var verbExists = fast.indexOf(verbs, req.method);

    debug('path/role:  %s  %s', pathExists, roleExists);

    if (NOTFOUND === verbExists) {
      debug('unauthorized3: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }
    
    //all good...
    next();
  };
};
