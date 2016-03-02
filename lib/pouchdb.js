"use strict";

module.exports = [{
  "path": "/_validate",
  "roles": [{
    "role": "public",
    "verbs": ["get", "put", "post"]
    }]
  },
  {
    "path": "/foobarrepl",
    "roles": [{
      "role": "public",
      "verbs": ["get", "post", "put"]
    }]
  },
  {
    "path": "/foobarrepl/_local",
    "roles": [{
      "role": "public",
      "verbs": ["get", "post", "put"]
    }]
  }, {
    "path": "/_session",
    "roles": [{
      "role": "public",
      "verbs": ["get"]
    }]
  }, {
    "path": "/_all_dbs",
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