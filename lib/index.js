'use strict';

var debug = require('debug')('thalisalti:acl');

var anonymous = 'public';

function mapIt(source, key, match) {
  var rv = source.map(function (el) {
    //debug('\t %s', el);
    if (el[key])
      return el[key];
    else
      return el;
  }).indexOf(match);
  return rv;
}

module.exports = function (acl) {
  //path.role.verb
  let msg401 = { success: false, message: 'Unauthorized' };

  return function (req, res, next) {
    debug('method: %s url: %s path: %s', req.method, req.url, req.path);
    
    //using headers for validation of the acl engine    
    let identity = req.connection.pskIdentity || anonymous;

    debug('Identity: %s', identity);

    let pathExists = mapIt(acl, 'path', req.path);
    if (!~pathExists) {
      return res.status(401).send(msg401);
    }
    
    let roles = acl[pathExists].roles;
    let roleExists = mapIt(roles, 'role', identity);
    if (!~roleExists) {
      return res.status(401).send(msg401);
    }    

    let verbs = acl[pathExists].roles[roleExists].verbs;
    let verbExists = mapIt(verbs, 'verb', req.method.toLowerCase());

    if (!~verbExists) {
      return res.status(401).send(msg401);
    }
    
    //all good...
    next();
  };
};


