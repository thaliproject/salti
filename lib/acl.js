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


// var a1 = [{
//     path: '/',
//     verbs: {
//         get: {
//             roles: ['public']
//         }
//     }
// }, {
//     path: '/foo',
//     verbs: {
//         get: {
//             roles: ['public']
//         }
//     }
// }, {
//     path: '/db',
//     verbs: {
//         get: {
//             roles: ['user']
//         }
//     }
// }, {
//     path: '/other',
//     verbs: {
//         get: {
//             roles: ['user']
//         },
//         post: {
//             roles: ['user']
//         }
//     }
// }];
// 
// //path.roles.verb
// 
// 
// //path.verb.roles
// var a2 = [
//   {
//     path: '/',
//     verbs: [
//       { verb: 'get' ,
//         roles: [
//          { role: 'public'}
//        ]
//       }
//     ]
//   }
// ];