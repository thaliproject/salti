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


function Filter(dbName, acl, thaliIdCallback, options) {
  // Both Filter(...) and new Filter(...) will work fine.
  if (!(this instanceof Filter)) {
    return new Filter(dbName, acl, thaliIdCallback, options);
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

  this.options = objectAssign({}, Filter.defaults, options);

  this.init();
  return this.handler.bind(this);
}

Filter.defaults = {
  stripTrailingSlash: true,
  prefix: undefined,
  dbPathTemplate: '{:db}',
  idTokenTemplate: '{:id}'
};

Filter.thaliPrefix = '/_local/thali_';

Filter.prototype.init = function () {
  var self = this;

  this.dbPath = this.dbName;
  if (this.options.prefix) {
    this.dbPath = this.options.prefix + '/' + this.dbPath;
  }
  this.dbPrefix = '/' + this.dbPath;

  // Replacing dbPath template (for example {:db}) with dbPath
  var dbPathRE = new RegExp(this.options.dbPathTemplate, 'g');
  this.acl.forEach(function (roleData) {
    roleData.paths.forEach(function (pathData) {
      pathData.path = pathData.path.replace(dbPathRE, self.dbPath);
    });
  });
}

Filter.prototype.handler = function (request, response, nextHandler) {
  this.request = request;
  this.response = response;
  this.nextHandler = nextHandler;
  this.path = request.path;
  debug('method: %s, url: %s, path: %s', this.request.method, this.request.url, this.path);

  if (!this.request.connection.pskRole) {
    return this.unauthorized(0);
  }
  this.role = this.request.connection.pskRole;
  debug('pskRole: %s', this.role);

  this.stripTrailingSlash();

  // Role data lookup on ACL.
  var roleIndex = fast.indexOf(this.acl, this.role, 'role');
  if (roleIndex === -1) {
    return this.unauthorized(1);
  }
  var paths = this.acl[roleIndex].paths;

  // Path data lookup on paths.
  var pathIndex = fast.indexOf(paths, this.path, 'path');
  if (pathIndex !== -1) {
    var verbs = paths[pathIndex].verbs;

    // Request method lookup on verbs.
    var verbIndex = fast.indexOf(verbs, this.request.method);
    if (verbIndex !== -1) {
      return this.authorized('found rawpath');
    } else {
      return this.unauthorized(2);
    }
  }

  // This section deals with /db/id, /db/_local/id and /db/id/attachment stuff.
  if (!this.cutDBPrefix()) {
    return this.unauthorized(3);
  }

  var pathParts = this.path.split('/');
  if (pathParts[0] !== '') {
    // Sanity check, the first element should always be empty.
    return this.unauthorized(4);
  }

  return this.unauthorized(5);
}

Filter.prototype.stripTrailingSlash = function () {
  if (this.options.stripTrailingSlash) {
    // Single slash '/' is a valid path, it should be ignored.
    var lastIndex = this.path.length - 1;
    if (lastIndex > 0 && this.path[lastIndex] === '/') {
      debug('ignoring trailing slash for %s', this.path);
      this.path = this.path.substring(0, lastIndex);
    }
  }
}

Filter.prototype.cutDBPrefix = function () {
  var isDbPath = this.path.startsWith(this.dbPrefix);
  if (!isDbPath) {
    return false;
  }
  this.path = this.path.substring(this.dbPrefix.length);
  return true;
}

Filter.prototype.authorized = function () {
  debug.apply(debug, arguments);
  this.nextHandler();
  return;
}

Filter.message401 = {
  success: false,
  message: 'Unauthorized'
};

Filter.prototype.unauthorized = function (index) {
  debug('unauthorized %s: pskRole: %s, path: %s, verb: %s', index, this.role, this.path, this.request.method);
  return this.response.status(401).send(Filter.message401);
}

module.exports = Filter;
