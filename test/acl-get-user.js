'use strict';

module.exports =  [
  {
    "path": '/',
    "roles": [
      {"role": 'user',
        "verbs": ['GET', 'PUT', 'POST']}
    ]
  },
  {
    "path": '/foo',
    "roles": [
      {"role": 'user',
        "verbs": ['GET', 'PUT', 'POST']}
    ]
  },
  {
    "path": '/bar',
    "roles": [
      {"role": 'user',
        "verbs": ['GET']}
    ]
  }
];
