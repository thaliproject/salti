'use strict';
var assert = require('assert');

var debug = require('debug')('thalisalti:acl');
var fast = require('./indexOf');

var NOTFOUND = -1;
var IDTOKEN = '{:id}';


/** Gets the req object, collection of paths, and path to validate */
function lookupPathVerb(req, paths, lookupPath) {
  var pathExists = fast.indexOf(paths, lookupPath, 'path');

  if (NOTFOUND === pathExists) {
    return false;
  }
  //verbs are just an array of strings
  var verbs = paths[pathExists].verbs;
  var verbExists = fast.indexOf(verbs, req.method);

  if (NOTFOUND === verbExists) {
    debug('verb and path not found: req.Path: %s  lookupPath: %s', req.path, lookupPath);
    return false;
  }
  
  return true;
}

/** given the path it determines the ID and calls the callback with that ID */
function getThaliId(path, dbname, callback) {
 
  var matches = path.match('^(\/' + dbname + '\/_local\/thali_)(.+)');
  if (matches && matches.length > 1) {
    if (matches[2]) {
      return callback(matches[2]);
    }
    return false;
  }
  return false;
}


module.exports = function(dbname, inAcl, callback) {

  if (!dbname || typeof dbname !== 'string') {
    throw new Error('invalid configuration - missing dbname');
  }

  if (!inAcl || !(inAcl instanceof Array)) {
    throw new Error('invalid configuration - inAcl is not an array');
  }
  
  if(!callback || typeof callback !== 'function'){
    throw new Error('invalid configuration - callback is NOT a function');
  }

  var thaliPrefix = '/' + dbname + '/_local/thali_';
  
  var acl = JSON.parse(JSON.stringify(inAcl).replace(/{:db}/g, dbname));

  //path.role.verb
  var msg401 = { success: false, message: 'Unauthorized' };

  return function(req, res, next) {
    var okPathVerb = false;
    debug('method: %s url: %s path: %s', req.method, req.url, req.path);

    if (!req.connection.pskRole) {
      debug('unauthorized0: no role: %s ', req.path);
      return res.status(401).send(msg401);
    }

    var pskRole = req.connection.pskRole;
    debug('pskRole: %s', pskRole);

    var roleExists = fast.indexOf(acl, pskRole, 'role');

    if (NOTFOUND === roleExists) {
      debug('unauthorized1: %s : %s', pskRole, req.path);
      return res.status(401).send(msg401);
    }

    var paths = acl[roleExists].paths;

    //here we're doing a strict simple RAW path lookup on ACLs
    var rawExists = fast.indexOf(paths, req.path, 'path');

    if (NOTFOUND !== rawExists) {
      //verbs are just an array of strings
      var verbs = paths[rawExists].verbs;
      var verbExists = fast.indexOf(verbs, req.method);

      if (NOTFOUND === verbExists) {
        debug('unauthorized3: %s : %s', pskRole, req.path);
        return res.status(401).send(msg401);
      }
      else {
        debug('found rawpath');
        okPathVerb = true;
      }
    }
    
    else {
      //this section deals with /db/id, /db/_local/id, and /db/id/attachment stuff.
      var pathParts = req.path.split('/');

      if (pathParts[0] !== '') {
        //sanity check.. the first element should always be empty.
        debug('unauthorized4.0: %s : %s', pskRole, req.path);
        return res.status(401).send(msg401);
      }

      var lookupPath = req.path.substring(0, req.path.lastIndexOf('/') + 1) + IDTOKEN;

      if (pathParts.length === 3) {
        //we have just a path and ID
        //do a search on /db/id and bail if NO GOOD
        if (!lookupPathVerb(req, paths, lookupPath)) {
          debug('unauthorized4.1: req.Path: %s  req.path: %s', req.path, lookupPath);
          return res.status(401).send(msg401);
        }
        else {
          debug('found path and id');
          okPathVerb = true;
        }
      }
      else if (pathParts.length === 4 && pathParts[2] === '_local') {
        //is this a /thali_ one?

        //TODO:
        var isThaliPrefix = req.path.startsWith(thaliPrefix);
        if (isThaliPrefix && ! lookupPathVerb(req, paths, thaliPrefix + IDTOKEN)){
          debug('unauthorized4.thaliPrefix: req.Path: %s  path: %s', req.path, thaliPrefix);
          return res.status(401).send(msg401);          
        }
        
        if (isThaliPrefix && !getThaliId(req.path, dbname, callback)) {
          debug('unauthorized4.thaliCallback: req.Path: %s  path: %s', req.path, thaliPrefix);
          return res.status(401).send(msg401);
        }

        if (!lookupPathVerb(req, paths, lookupPath)) {
          debug('unauthorized4.2: req.Path: %s  req.path: %s', req.path, lookupPath);
          return res.status(401).send(msg401);
        }
        else {
          debug('passed _local and thali checks.');
          okPathVerb = true;
        }
      }
      else if (pathParts.length === 4 && pathParts[3] === 'attachment') {
        var attachmentPath = '/' + pathParts[1] + '/' + IDTOKEN + '/attachment';

        if (!lookupPathVerb(req, paths, attachmentPath)) {
          debug('unauthorized4.3: req.Path: %s  req.path: %s', req.path, attachmentPath);
          return res.status(401).send(msg401);
        }
        else {
          okPathVerb = true;
        }
      }
      else {
        debug('unauthorized5: %s : %s', pskRole, req.path);
        return res.status(401).send(msg401);
      }
    }

    //might want to check if isvalid true too.
    //All good - next in pipeline
    debug('outside all ifs okPathVerb: %s', okPathVerb);

    assert.ok(okPathVerb);
    next();

  };
};
