"use strict";

module.exports =  [
  {
    "path": "/publicall",
    "roles": [
      {"role": "public",
        "verbs": ["GET", "POST", "PUT"]},
      {"role": "user",
        "verbs": ["GET"]}
    ]
  },
  {
    "path": "/fatfinger",
    "roles": [
      {"role": "public",
        "verbs": []},
      {"role": "user",
        "verbs": ["POST", "PUT", "GET", "GET", "PUT", "POST"]}
    ]
  },
  {
    "path": "/publicget",
    "roles": [
      {"role": "public",
        "verbs": ["GET"]},
      {"role": "user",
        "verbs": ["GET", "POST", "PUT"]}
    ]
  }
];
