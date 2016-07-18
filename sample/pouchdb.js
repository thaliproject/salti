"use strict";

module.exports = [{
  'role': 'public',
  'paths': [{
      'path': '/_validate',
      'verbs': ['GET', 'PUT', 'POST']
    },{
      'path': '/foobarrepl',
      'verbs': ['GET', 'POST', 'PUT']
    },{
      'path': '/foobarrepl/_local',
      'verbs': ['GET', 'POST', 'PUT']
    },{
      'path': '/_session',
      'verbs': ['GET']
    },{
      'path': '/_all_dbs',
      'verbs': ['GET', 'PUT', 'POST']
    },{
      'path': '/_utils',
      'verbs': ['GET']
    }
  ]
}];
