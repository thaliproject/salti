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
        "verbs": ["GET"]
    }, {
        "role": "user",
        "verbs": ["GET"]
    }]
}, {
    "path": "/foo/",
    "roles": [{
        "role": "public",
        "verbs": ["GET", "POST"]
    }, {
        "role": "user",
        "verbs": ["GET", "PUR", "POST"]
    }]
}, {
    "path": "/bar",
    "roles": [{
        "role": "public",
        "verbs": ["GET"]
    }, {
        "role": "user",
        "verbs": ["GET"]
    }]
}];
