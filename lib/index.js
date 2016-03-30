'use strict';

var debug = require('debug')('thalisalti:acl');
var fast = require('./indexOf');

var noRole = 'public';
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
 * @param {String} dbname - dbname known to provider
 * @param {Salti.Acl} inAcl - acl represented as an array of path.role.verb
 * @returns {Function} returns a handler of (req, res, next) to the middleware pipeline
 */
module.exports = function (dbname, inAcl) {

  if ( !dbname || typeof dbname !== 'string'){
    throw new Error('invalid configuration - missing dbname');
  }
  
  if ( !inAcl || ! (inAcl instanceof Array)){
    throw new Error('invalid configuration - inAcl is not an array');
  }
  
  var acl =JSON.parse(JSON.stringify(inAcl).replace('{:db}', dbname));
  
  //path.role.verb
  var msg401 = { success: false, message: 'Unauthorized' };

  return function (req, res, next) {
    debug('method: %s url: %s path: %s', req.method, req.url, req.path);
    
    //using headers for validation of the acl engine       
    var pskRole = req.connection.pskRole || noRole;
    debug('pskRole: %s', pskRole);

    //if the path is just '/' then use that, otherwise, find the path
    // //without the trailing '/'
    // var path = req.path === '/' ? '/' 
    //       : req.path.slice(-1) === '/' ? req.path.slice(0, -1) 
    //           : req.path;
        
    var roleExists = fast.indexOf(acl, pskRole, 'role');

    //here we're looking for an EXACT match as is - with full path and NO resource on the end...
    //ie.  /foobar/myresource.js  - this will fail if /foobar is in the ACL's
    
    if (NOTFOUND === roleExists) {
      debug('unauthorized1: %s : %s', pskRole, req.path);
      return res.status(401).send(msg401);
    }

    var paths = acl[roleExists].paths;
    var pathExists = fast.indexOf(paths, req.path, 'path');
    
    if (NOTFOUND === pathExists) {
      debug('unauthorized2: %s : %s', pskRole, req.path);
      return res.status(401).send(msg401);
    }

    //verbs are just an array of strings
    var verbs = paths[roleExists].verbs;
    var verbExists = fast.indexOf(verbs, req.method);

    if (NOTFOUND === verbExists) {
      debug('unauthorized3: %s : %s', pskRole, req.path);
      return res.status(401).send(msg401);
    }
    
    //all good...
    next();
  };
};
