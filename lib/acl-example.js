"use strict";

//go here with the schema and build away...
//http://jeremydorn.com/json-editor/
//http://bit.ly/1Qs3l66

//ideally - 1 less check if path has a trailing /..  
// ie.   /foo/ is faster than /bar

module.exports =  [{
    "path": "/",
    "roles": [{
        "role": "public",
        "verbs": ["get"]
    }, {
        "role": "user",
        "verbs": ["get"]
    }]
}, {
    "path": "/foo/",
    "roles": [{
        "role": "public",
        "verbs": ["get", "post"]
    }, {
        "role": "user",
        "verbs": ["get", "put", "post"]
    }]
}, {
    "path": "/bar",
    "roles": [{
        "role": "public",
        "verbs": ["get"]
    }, {
        "role": "user",
        "verbs": ["get"]
    }]
}];
