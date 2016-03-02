'use strict';

module.exports =  [
  {
    "path": '/base',
    "roles": [
      {"role": 'public',
        "verbs": ['get', 'put', 'post']}
    ]
  },
    {
    "path": '/foo/',
    "roles": [
      {"role": 'public',
        "verbs": ['get', 'put', 'post']}
    ]
  },
    {
    "path": '/bar/foo',
    "roles": [
      {"role": 'public',
        "verbs": ['get', 'put', 'post']}
    ]
  },
    {
    "path": '/fiz/baz/',
    "roles": [
      {"role": 'public',
        "verbs": ['get', 'put', 'post']}
    ]
  }
];