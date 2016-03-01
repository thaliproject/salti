'use strict';

module.exports =  [
  {
    path: '/',
    roles: [
      {role: 'public',
        verbs: ['get']},
      {role: 'user',
        verbs: ['get']}
    ]
  },
  {
    path: '/foo',
    roles: [
      {role: 'public',
        verbs: ['get', 'post']},
      {role: 'user',
        verbs: ['get', 'put', 'post']}
    ]
  },
  {
    path: '/bar',
    roles: [
      {role: 'public',
        verbs: ['get']},
      {role: 'user',
        verbs: ['get']}
    ]
  }
];
