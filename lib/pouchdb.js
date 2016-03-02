'use strict';

module.exports =  [{
    "path": '/_utils/',
    "roles": [{
        "role": 'public',
        "verbs": ['get']
    }, {
        "role": 'user',
        "verbs": ['get']
    }]
}, {
    "path": '/db/',
    "roles": [{
        "role": 'public',
        "verbs": ['get']
    }]
},
{
    "path": '/_utils/css/',
    "roles": [{
        "role": 'public',
        "verbs": ['get']
    }]
},
{
    "path": '/_utils/js/',
    "roles": [{
        "role": 'public',
        "verbs": ['get']
    }]
}];



//db_utils
//db/css/