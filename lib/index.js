'use strict';

var debug = require('debug')('thalisalt:acl');

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

module.exports =
function (acl) {
  //path.role.verb
  var msg401 = { success: false, message: 'Unauthorized' };

  return function (req, res, next) {
    debug('method: %s url: %s path: %s', req.method, req.url, req.path);
    
    //using headers for validation of the acl engine    
    let identity = req.headers.identity || anonymous;

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
    
    debug('you got this far...');
    let verbs = acl[pathExists].roles[roleExists].verbs;
    debug(verbs);
    debug(req.method.toLowerCase());
    var verbExists = mapIt(verbs, 'verb', req.method.toLowerCase());

    debug('got all the way to a verb: %s', verbExists);

    if (!~verbExists) {
      return res.status(401).send(msg401);

    }
    next();
  };
};


