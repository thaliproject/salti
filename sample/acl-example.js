"use strict";

//go here with the schema and build away...
//http://jeremydorn.com/json-editor/

module.exports = [
  {
    'role': 'public',
    'paths': [
      {
        'path': '/',
        'verbs': ['GET']
      },
      {
        'path': '/foo',
        'verbs': ['GET', 'POST']
      },
      {
        'path': '/bar',
        'verbs': ['GET']
      }
    ]
  },
  {
    'role': 'user',
    'paths': [
      {
        'path': '/',
        'verbs': ['GET']
      },
      {
        'path': '/foo',
        'verbs': ['GET', 'PUT', 'POST']
      },
      {
        'path': '/bar',
        'verbs': ['GET']
      }
    ]
  }
];
