/*jshint -W121 */
'use strict';

var objectAssign = require('object-assign');
var jsonValidate = require('jsonschema').validate;
var debug = require('debug')('thalisalti:acl');

var aclSchema = require('./acl-schema.json');
var fast = require('./indexOf');


if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    return this.substr(position || 0, searchString.length) === searchString;
  };
}


function Salti(dbName, acl, thaliIdCallback, options) {
  // Both Salti(...) and new Salti(...) will work fine.
  if (!(this instanceof Salti)) {
    return new Salti(dbName, acl, thaliIdCallback, options);
  }

  if (!dbName || typeof dbName !== 'string') {
    throw new Error('invalid configuration - missing dbName');
  }
  this.dbName = dbName;

  if (!acl || !aclSchema || !jsonValidate(acl, aclSchema).valid) {
    throw new Error('invalid configuration - acl is not valid');
  }
  // ACL data should be cloned.
  this.acl = JSON.parse(JSON.stringify(acl));

  if (!thaliIdCallback || typeof thaliIdCallback !== 'function') {
    throw new Error('invalid configuration - callback is not a function');
  }
  this.thaliIdCallback = thaliIdCallback;

  this.options = objectAssign({}, Salti.defaults, options);

  this.init();
  return this.handler.bind(this);
}

Salti.defaults = {
  stripTrailingSlash: true,
  dbPrefix: undefined,
  dbPathTemplate: '{:db}',
  idTokenTemplate: '{:id}'
};

Salti.THALI_PREFIX = '/_local/thali_';

Salti.prototype.init = function () {
  var self = this;

  this.dbPath = this.dbName;
  if (this.options.dbPrefix) {
    // DB prefix in options can include leading slash.
    // We should strip it for DB path.
    this.dbPath = Salti.stripLeadingSlash(this.options.dbPrefix) + '/' +
      this.dbPath;
  }
  this.dbPrefix = '/' + this.dbPath;

  // Replacing dbPath template (for example {:db}) with dbPath
  var dbPathRE = new RegExp(this.options.dbPathTemplate, 'g');
  this.acl.forEach(function (roleData) {
    if (roleData.paths) {
      // If paths exists it will be an array (schema is verified).
      roleData.paths.forEach(function (pathData) {
        pathData.path = pathData.path.replace(dbPathRE, self.dbPath);
      });
    }
  });
};

Salti.prototype.handler = function (request, response, nextHandler) {
  this.request = request;
  this.response = response;
  this.nextHandler = nextHandler;
  this.path = request.path;
  debug(
    'method: %s, url: %s, path: %s',
    this.request.method, this.request.url, this.path
  );

  if (!this.request.connection.pskRole) {
    return this.unauthorized(0);
  }
  this.role = this.request.connection.pskRole;
  debug('pskRole: %s', this.role);

  if (this.options.stripTrailingSlash) {
    this.path = Salti.stripTrailingSlash(this.path);
  }

  // Role data lookup on ACL.
  var roleIndex = fast.indexOf(this.acl, this.role, 'role');
  if (roleIndex === -1) {
    return this.unauthorized(1);
  }
  var paths = this.acl[roleIndex].paths;

  // Raw paths lookup.
  var lookupResult = this.lookupPathVerb(paths, this.path);
  if (lookupResult === Salti.PATH_VERB_FOUND) {
    return this.authorized('found raw path');
  } else if (lookupResult === Salti.VERB_NOTFOUND) {
    // Raw path is found, but verb is not found.
    return this.unauthorized(2);
  }

  // Next section deals with
  // /{:db}/{:id}, /{:db}/_local/{:id} and /{:db}/{:id}/attachment stuff.
  var cutPath = this.getPathWithoutPrefix();
  if (!cutPath) {
    // Required DB Prefix is not valid.
    return this.unauthorized(3);
  }

  var pathParts = cutPath.split('/');
  if (pathParts[0] !== '') {
    // Sanity check, the first element should always be empty.
    return this.unauthorized(4);
  }

  var lookupPath;

  if (pathParts.length === 2) {
    // Is /{:id} authorized?
    lookupPath = this.dbPrefix + '/' + this.options.idTokenTemplate;
    if (this.lookupPathVerb(paths, lookupPath) === Salti.PATH_VERB_FOUND) {
      return this.authorized('found raw path and id');
    } else {
      return this.unauthorized(5);
    }
  }

  else if (pathParts.length === 3 && pathParts[1] === '_local') {
    // Is this a thali {:id}?
    var isThaliPrefix = cutPath.startsWith(Salti.THALI_PREFIX);
    if (isThaliPrefix) {
      // Is /_local/thali_{:id} authorized?
      lookupPath = this.dbPrefix + Salti.THALI_PREFIX +
        this.options.idTokenTemplate;
      if (this.lookupPathVerb(paths, lookupPath) !== Salti.PATH_VERB_FOUND) {
        debug('unauthorized thali prefix');
        return this.unauthorized(6);
      }
      var thaliId = cutPath.substring(Salti.THALI_PREFIX.length);
      if (!this.resolveThaliId(thaliId)) {
        debug('unauthorized thali id');
        return this.unauthorized(7);
      }
      debug('passed _thali check');
    }

    // Is /_local/{:id} authorized?
    lookupPath = this.dbPrefix + '/_local/' + this.options.idTokenTemplate;
    if (this.lookupPathVerb(paths, lookupPath) === Salti.PATH_VERB_FOUND) {
      return this.authorized('passed _local check');
    } else {
      return this.unauthorized(8);
    }
  }

  else if (pathParts.length === 3 && pathParts[2] === 'attachment') {
    // Is /{:id}/attachment authorized?
    lookupPath = this.dbPrefix + '/' + this.options.idTokenTemplate +
      '/attachment';
    if (this.lookupPathVerb(paths, lookupPath) === Salti.PATH_VERB_FOUND) {
      return this.authorized('passed attachment check');
    } else {
      return this.unauthorized(9);
    }
  }

  return this.unauthorized(10);
};

Salti.PATH_VERB_FOUND = 0;
Salti.PATH_NOTFOUND = 1;
Salti.VERB_NOTFOUND = 2;
Salti.prototype.lookupPathVerb = function (paths, lookupPath) {
  // Path data lookup on paths.
  var pathIndex = fast.indexOf(paths, lookupPath, 'path');
  if (pathIndex === -1) {
    debug('path is not found: lookupPath: %s', lookupPath);
    return Salti.PATH_NOTFOUND;
  }
  // Request method lookup on verbs.
  var verbs = paths[pathIndex].verbs;
  var verbIndex = fast.indexOf(verbs, this.request.method);
  if (verbIndex === -1) {
    debug(
      'verb and path are not found: lookupPath: %s, verb: %s',
      lookupPath, this.request.method
    );
    return Salti.VERB_NOTFOUND;
  }
  return Salti.PATH_VERB_FOUND;
};

Salti.prototype.resolveThaliId = function (thaliId) {
  if (thaliId.length > 0) {
    return this.thaliIdCallback(thaliId, this.request);
  }
  return false;
};

Salti.stripLeadingSlash = function (path) {
  if (path.length > 0 && path[0] === '/') {
    debug('ignoring leading slash for %s', path);
    return path.substring(1);
  }
  return path;
};
Salti.stripTrailingSlash = function (path) {
  // Single slash '/' is a valid path.
  // It's slash is leading, not trailing.
  // We shouldn't strip it.
  var lastIndex = path.length - 1;
  if (lastIndex > 0 && path[lastIndex] === '/') {
    debug('ignoring trailing slash for %s', path);
    return path.substring(0, lastIndex);
  }
  return path;
};

Salti.prototype.getPathWithoutPrefix = function () {
  var isDbPath = this.path.startsWith(this.dbPrefix);
  if (!isDbPath) {
    return null;
  }
  return this.path.substring(this.dbPrefix.length);
};

Salti.prototype.authorized = function () {
  debug.apply(debug, arguments);
  this.nextHandler();
  return;
};

Salti.MESSAGE_401 = {
  success: false,
  message: 'Unauthorized'
};

Salti.prototype.unauthorized = function (index) {
  debug(
    'unauthorized %s: pskRole: %s, path: %s, verb: %s',
    index, this.role, this.path, this.request.method
  );
  return this.response.status(401).send(Salti.MESSAGE_401);
};

module.exports = Salti;
