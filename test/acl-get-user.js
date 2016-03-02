'use strict';

module.exports =  [
  {
    "path": '/',
    "roles": [
      {"role": 'user',
        "verbs": ['get', 'put', 'post']}
    ]
  },
  {
    "path": '/foo',
    "roles": [
      {"role": 'user',
        "verbs": ['get', 'put', 'post']}
    ]
  },
  {
    "path": '/bar',
    "roles": [
      {"role": 'user',
        "verbs": ['get']}
    ]
  }
];