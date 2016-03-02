'use strict';

var debug = require('debug')('thalisalti:acl');
var fast = require('./indexOf');

var anonymous = 'public';

function mapIt(subject, key, target) {
  var itExists = fast.indexOf(subject, target, key, 0);
  if (!~itExists) {
    return itExists;
  }

  return fast.indexOf(subject, target, key, 0);
}

module.exports = function (acl) {
  //path.role.verb
  let msg401 = { success: false, message: 'Unauthorized' };

  return function (req, res, next) {
    debug('method: %s url: %s path: %s', req.method, req.url, req.path);
    
    //using headers for validation of the acl engine    
    let identity = req.connection.pskIdentity || anonymous;
    debug('Identity: %s', identity);

    var pathExists = mapIt(acl, 'path', req.path);
    debug('req.path: %s', req.path);
    
    //here we fall back to see 
    if (!~pathExists) {
      let justPath = req.path.substring(0, req.path.lastIndexOf("/"));

      debug('raw path did not exist now till try with trailing slash');
      pathExists = mapIt(acl, 'path', justPath + '/');
      if (!~pathExists) {
        debug('now we try with no trailing slash');
        pathExists = mapIt(acl, 'path', justPath);
        if (!~pathExists) {
          debug('unauthorized1: %s : %s', identity, req.path);
          return res.status(401).send(msg401);
        }
      }
    }

    let roles = acl[pathExists].roles;
    let roleExists = mapIt(roles, 'role', identity);
    if (!~roleExists) {
      debug('unauthorized2: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }

    let verbs = acl[pathExists].roles[roleExists].verbs;
    let verbExists = mapIt(verbs, null, req.method.toLowerCase());
    
    debug('path/role:  %s  %s', pathExists, roleExists);

    if (!~verbExists) {
      debug('unauthorized3: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }
    
    //all good...
    next();
  };
};


