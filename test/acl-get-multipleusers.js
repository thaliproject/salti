'use strict';

module.exports =  [
  {
    path: '/publicall',
    roles: [
      {role: 'public',
        verbs: ['get', 'post', 'put']},
      {role: 'user',
        verbs: ['get']}
    ]
  },
  {
    path: '/fatfinger',
    roles: [
      {role: 'public',
        verbs: []},
      {role: 'user',
        verbs: ['post', 'put', 'get', 'get', 'put', 'post']}
    ]
  },
  {
    path: '/publicget',
    roles: [
      {role: 'public',
        verbs: ['get']},
      {role: 'user',
        verbs: ['get', 'post', 'put']}
    ]
  }
];
