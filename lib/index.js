'use strict';

var debug = require('debug')('thalisalti:acl');

var anonymous = 'public';

function mapIt(source, key, match) {
  return source.map(function (el) {
    debug('\t %s', el);
    debug(el[key]);
    if (el[key])
      return el[key];
    else
      return el;
  }).indexOf(match);
  //return rv;
}

module.exports = function (acl) {
  //path.role.verb
  let msg401 = { success: false, message: 'Unauthorized' };

  return function (req, res, next) {
    debug('method: %s url: %s path: %s', req.method, req.url, req.path);
    
    //do a match with a slash on the end...
    //if that fails do a match that is lastindex of...
    
    
    //using headers for validation of the acl engine    
    let identity = req.connection.pskIdentity || anonymous;

    debug('Identity: %s', identity);
    
    var pathExists = mapIt(acl, 'path', req.path);
    debug('req.path: %s', req.path);
    if (!~pathExists) {
      let justPath = req.path.substring(0, req.path.lastIndexOf("/") + 1);
      debug('justpath: %s', justPath);
      pathExists = mapIt(acl, 'path', justPath);
      if (!~pathExists){
        debug('unauthorized1: %s : %s', identity, req.path);
        return res.status(401).send(msg401);
      }
    }

    let roles = acl[pathExists].roles;
    let roleExists = mapIt(roles, 'role', identity);
    if (!~roleExists) {
      debug('unauthorized2: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }

    let verbs = acl[pathExists].roles[roleExists].verbs;
    let verbExists = mapIt(verbs, 'verb', req.method.toLowerCase());

    if (!~verbExists) {
      debug('unauthorized3: %s : %s', identity, req.path);
      return res.status(401).send(msg401);
    }
    
    //all good...
    next();
  };
};


