"use strict";

module.exports = [{
  "path": "/_utils",
  "roles": [{
    "role": "public",
    "verbs": ["get"]
  }, {
      "role": "user",
      "verbs": ["get"]
    }]
},
  {
    "path": "/db",
    "roles": [{
      "role": "public",
      "verbs": ["get"]
    }]
  },
  {
    "path": "/_utils/css",
    "roles": [{
      "role": "public",
      "verbs": ["get"]
    }]
  },
  {
    "path": "/_utils/js",
    "roles": [{
      "role": "public",
      "verbs": ["get"]
    }]
  }, {
    "path": "/_utils/img",
    "roles": [{
      "role": "public",
      "verbs": ["get"]
    }]
  }, {
    "path": "/_session",
    "roles": [{
      "role": "public",
      "verbs": ["get"]
    }]
  }, {
    "path": "/_utils/fonts",
    "roles": [{
      "role": "public",
      "verbs": ["get"]
    }]
  }, {
    "path": "/foobardb",
    "roles": [{
      "role": "public",
      "verbs": ["get", "put", "post"]
    }]
  }, {
    "path": "/_all_dbs",
    "roles": [{
      "role": "public",
      "verbs": ["get", "put", "post"]
    }]
  }, {
    "path": "/_utils/js/zeroclipboard",
    "roles": [{
      "role": "public",
      "verbs": ["get", "put", "post"]
    }]
  },
   {
    "path": "/_uuids",
    "roles": [{
      "role": "public",
      "verbs": ["get", "put", "post"]
    }]
  },
   {
    "path": "/favicon.ico",
    "roles": [{
      "role": "public",
      "verbs": ["get", "put", "post"]
    }]
  }];


///_uuids 

///_all_dbs 
// /_utils/js/zeroclipboard/Z
//db_utils
//db/css/