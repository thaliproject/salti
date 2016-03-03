'use strict';

module.exports =  [
  {
    "path": '/base',
    "roles": [
      {"role": 'public',
        "verbs": ['GET', 'PUT', 'POST']}
    ]
  },
    {
    "path": '/foo/',
    "roles": [
      {"role": 'public',
        "verbs": ['GET', 'PUT', 'POST']}
    ]
  },
    {
    "path": '/bar/foo',
    "roles": [
      {"role": 'public',
        "verbs": ['GET', 'PUT', 'POST']}
    ]
  },
    {
    "path": '/fiz/baz/',
    "roles": [
      {"role": 'public',
        "verbs": ['GET', 'PUT', 'POST']}
    ]
  }
];
