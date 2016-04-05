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
module.exports = function(dbname, inAcl) {

  if (!dbname || typeof dbname !== 'string') {
    throw new Error('invalid configuration - missing dbname');
  }

  if (!inAcl || !(inAcl instanceof Array)) {
    throw new Error('invalid configuration - inAcl is not an array');
  }

  var acl = JSON.parse(JSON.stringify(inAcl).replace(/{:db}/g, dbname));

  //path.role.verb
  var msg401 = { success: false, message: 'Unauthorized' };

  return function(req, res, next) {
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

    if (NOTFOUND === roleExists) {
      debug('unauthorized1: %s : %s', pskRole, req.path);
      return res.status(401).send(msg401);
    }

    var paths = acl[roleExists].paths;
    var pathExists = fast.indexOf(paths, req.path, 'path');

    if (NOTFOUND !== pathExists) {
      //verbs are just an array of strings
      var verbs = paths[pathExists].verbs;
      var verbExists = fast.indexOf(verbs, req.method);

      if (NOTFOUND === verbExists) {
        debug('unauthorized3: %s : %s', pskRole, req.path);
        return res.status(401).send(msg401);
      }

      //all good...
      next();
    }
    else {
      //simple regex on /dbname/word
      // /dbname/_local/thali_WORD
      
      /**
       * get the lastindex of '/'  then it should match either
       * /db   or /db/local
       * 
       * if /db
       * match /{:db}/id  GET  
       * match /{:db}/id/attachment   GET
       * 
       * \/foobar\/([^_](.*\/attachment|.*))
       *
       * 
       * else /db/local
       * 
       * simple.. 
       * 
       * (\/foobar\/_local\/([^\/]*))
       * 
       * working: ([^/]+)/?(.*)$
       *
       * 
       * \/foobar\/_local\/(.+)(?!\/)
       *
       * this will match and 2nd group check for xlashes
       * ****
       * 
       * (\/foobar\/_local\/)(.+)
       * 
       * (\/foobar\/_local\/)(.*(?!\/))
       * 
       * 
       * (\/foobar\/_local\/)((?!\/).+)
       * (\/foobar\/_local\/)((?!\/).+)
       * 
       * 
       * ////\/foobar\/_local\/((?!\/).+)
       * 
       * since .../thali_ and id are same GET/PUT/DELETE just do 
       * /db/local/id
       * 
       * 
       */
      
      
      
    /** Here's the rules -
*   "path" :"/{:db}/{:id}",
    "verbs" :["GET"]
  }, {
    "path" :"/{:db}/{:id}/attachment",
    "verbs":["GET"]
  }, {
    "path" :"/{:db}/_local/thali_{:id}",  - this is semantically the same as the following /_local/id
    "verbs":["GET", "PUT", "DELETE"]
  }, {
    "path": "/{:db}/_local/{:id}",
    "verbs":["GET", "PUT", "DELETE"]
  }
       */
      
      
      //where into the special resource ID paths here...
      var path = req.path === '/' ? '/'
        : req.path.slice(-1) === '/' ? req.path.slice(0, -1)
          : req.path;

      debug('new path: %s', path);

      debug('unauthorized2: %s : %s', pskRole, req.path);
      return res.status(401).send(msg401);
    }


  };
};
