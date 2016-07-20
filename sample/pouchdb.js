"use strict";

module.exports = [{
  "role": "public",
  "paths": [
    {
      "path": "/_validate",
      "verbs": ["GET"]
    },
    {
      "path": "/_validate/_bulk_docs",
      "verbs": ["POST"]
    },
    {
      "path": "/_validate/_all_docs",
      "verbs": ["GET"]
    },

    {
      "path": "/foobarrepl",
      "verbs": ["GET"]
    },
    {
      "path": "/foobarrepl/_local/{:id}",
      "verbs": ["GET"]
    },
    {
      "path": "/foobarrepl/_bulk_docs",
      "verbs": ["POST"]
    },
    {
      "path": "/foobarrepl/_revs_diff",
      "verbs": ["POST"]
    },
    {
      "path": "/foobarrepl/_all_docs",
      "verbs": ["GET"]
    },

    {
      "path": "/foobar",
      "verbs": ["GET"]
    },
    {
      "path": "/foobar/_all_docs",
      "verbs": ["GET"]
    },

    {
      "path": "/_utils",
      "verbs": ["GET"]
    },
    {
      "path": "/_utils/css/index-6688cd4426ead40b085270f8cb007530.css",
      "verbs": ["GET"]
    },
    {
      "path": "/_utils/js/require-34a7e370ea98389d118cc328682c0939.js",
      "verbs": ["GET"]
    },
    {
      "path": "/_utils/img/pouchdb-site.png",
      "verbs": ["GET"]
    },
    {
      "path": "/_utils/fonts/fontawesome-webfont.woff",
      "verbs": ["GET"]
    },
    {
      "path": "/_utils/fonts/fauxtonicon.woff",
      "verbs": ["GET"]
    },
    {
      "path": "/favicon.ico",
      "verbs": ["GET"]
    },
    {
      "path": "/_all_dbs",
      "verbs": ["GET"]
    },
    {
      "path": "/_session",
      "verbs": ["GET"]
    }
  ]
}];
