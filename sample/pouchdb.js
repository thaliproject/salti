"use strict";

module.exports = [{
  "path": "/_validate",
  "roles": [{
    "role": "public",
    "verbs": ["GET", "PUT", "POST"]
    }]
  },
  {
    "path": "/foobarrepl",
    "roles": [{
      "role": "public",
      "verbs": ["GET", "POST", "PUT"]
    }]
  },
  {
    "path": "/foobarrepl/_local",
    "roles": [{
      "role": "public",
      "verbs": ["GET", "POST", "PUT"]
    }]
  }, {
    "path": "/_session",
    "roles": [{
      "role": "public",
      "verbs": ["GET"]
    }]
  }, {
    "path": "/_all_dbs",
    "roles": [{
      "role": "public",
      "verbs": ["GET", "PUT", "POST"]
    }]
  }];
