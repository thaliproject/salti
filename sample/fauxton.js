"use strict";

module.exports = [{
  "path": "/_utils",
  "roles": [{
    "role": "public",
    "verbs": ["GET"]
  }, {
      "role": "user",
      "verbs": ["GET"]
    }]
},
  {
    "path": "/db",
    "roles": [{
      "role": "public",
      "verbs": ["GET"]
    }]
  },
  {
    "path": "/_utils/css",
    "roles": [{
      "role": "public",
      "verbs": ["GET"]
    }]
  },
  {
    "path": "/_utils/js",
    "roles": [{
      "role": "public",
      "verbs": ["GET"]
    }]
  }, {
    "path": "/_utils/img",
    "roles": [{
      "role": "public",
      "verbs": ["GET"]
    }]
  }, {
    "path": "/_session",
    "roles": [{
      "role": "public",
      "verbs": ["GET"]
    }]
  }, {
    "path": "/_utils/fonts",
    "roles": [{
      "role": "public",
      "verbs": ["GET"]
    }]
  }, {
    "path": "/foobardb",
    "roles": [{
      "role": "public",
      "verbs": ["GET", "PUT", "POST"]
    }]
  }, {
    "path": "/_all_dbs",
    "roles": [{
      "role": "public",
      "verbs": ["GET", "PUT", "POST"]
    }]
  }, {
    "path": "/_utils/js/zeroclipboard",
    "roles": [{
      "role": "public",
      "verbs": ["GET", "PUT", "POST"]
    }]
  },
   {
    "path": "/_uuids",
    "roles": [{
      "role": "public",
      "verbs": ["GET", "PUT", "POST"]
    }]
  },
   {
    "path": "/favicon.ico",
    "roles": [{
      "role": "public",
      "verbs": ["GET", "PUT", "POST"]
    }]
  }];


///_uuids 

///_all_dbs 
// /_utils/js/zeroclipboard/Z
//db_utils
//db/css/
