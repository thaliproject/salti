'use strict';

var debug = require('debug')('thalisalti:acl');
var fast = require('./indexOf');

var anonymous = 'public';
const NOTFOUND = -1;

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
  let msg401 = { success: false, message: 'Unauthorized' };

  return function (req, res, next) {
    debug('method: %s url: %s path: %s', req.method, req.url, req.path);
    
    //using headers for validation of the acl engine    
    let identity = req.connection.pskIdentity || anonymous;
    debug('Identity: %s', identity);

    //here we're looking for an EXACT match as is - with full path and any resource on the end...
    //ie.  /foobar/myresource.js
    var pathExists = fast.indexOf(acl, req.path, 'path');
    debug('req.path: %s', req.path);
    
    if ( NOTFOUND === pathExists) {      
      debug('raw path did not exist now till try with trailing slash');
      //lets get the path up to the / but NOT with the slash...
      let justPath = req.path.substring(0, req.path.lastIndexOf("/"));

      //here we see if it exists up to the last slash (including the slash)
      //ie - /foobar/
      pathExists = fast.indexOf(acl, justPath + '/', 'path');
      if ( NOTFOUND === pathExists) {
        //here we fall back to see if the path exists up to the last slash (not including)
        //ie - /foobar
        debug('now we try with no trailing slash');
        pathExists = fast.indexOf(acl, justPath, 'path');
        if ( NOTFOUND === pathExists) {
          debug('unauthorized1: %s : %s', identity, req.path);
          return res.status(401).send(msg401);
        }
      }
    }

    //at this point the request PATH has passed...
    let roles = acl[pathExists].roles;
    let roleExists = fast.indexOf(roles, identity, 'role');
    if ( NOTFOUND === roleExists) {
      debug('unauthorized2: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }

    let verbs = acl[pathExists].roles[roleExists].verbs;
    let verbExists = fast.indexOf(verbs, req.method);
    
    debug('path/role:  %s  %s', pathExists, roleExists);

    if ( NOTFOUND === verbExists) {
      debug('unauthorized3: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }
    
    //all good...
    next();
  };
};
