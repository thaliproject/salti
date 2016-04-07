# SALTI
[![Build Status](https://travis-ci.org/cicorias/salt2.svg?branch=master)](https://travis-ci.org/cicorias/salt2)
[![Coverage Status](https://coveralls.io/repos/github/thaliproject/salti/badge.svg?branch=initial)](https://coveralls.io/github/thaliproject/salti?branch=initial)
[![Coverage Status](https://coveralls.io/repos/github/thaliproject/salti/badge.svg?branch=master)](https://coveralls.io/github/thaliproject/salti?branch=master)

## Simple Authentication and Authorization Library for Thali IoT

A very simple `PATH` and `VERB` base filtering of requests. Since PouchDB and Express-PouchDB are REST oriented, their permission model is basicaly REST - ie. `PUT, POST, etc.`
This library is intended to be utilized with Pre-Shared Key (PSK) support.  See [JxCore #PR813](https://github.com/jxcore/jxcore/pull/813)

In addition, this is a simple Express middleware library that gets added to the Express app.
For our needs, it is being added to the Express-Pouch layer and provides simple authentication and authorization through a simplified JSON structure.
## Setup and Configuration
By default, the module, if it doesn't find any `pskIdentity` on the `req.connection` object it will assume its basicaly anonymous and assign sometning called `public'.  Thus any ACL rules that have `public` will apply to that.

For example (see more about the ACL format below) - public is show here - giving `public` access to the path `/foo` for verbs of `GET` and `POST`.

```json
{
    "path": "/foo/",
    "roles": [{
        "role": "public",
        "verbs": ["GET", "POST"]
    }, {
        "role": "user",
        "verbs": ["GET", "PUT", "POST"]
    }]
}

```
### PSK Identity

When running JxCore using the PSK support, on the server side, it's necessary to add a property to the `reqquest.connection` object - like so:

```javascript
var server = tls.createServer(serverOptions, function (connection) {
  //the object provided is a 'connection'
  console.log('%s connected', connection.pskIdentity);
  //do something with this - implementation specific...
  serverResults.push(connection.pskIdentity + ' ' + (connection.authorized ? 'authorized' : 'not authorized'));
  
  if (connection.authorized){
    //here we lookup a 'role' which will match what's in the ACL json - 
    var roleLookup = getRole(connection.pskIdentity);
    connection.pskIdentity = roleLookup;
  };
  //blah
  connection.once('data', function (data) {
    //
  });

});

```

## Configuration of the Express-PouchDB server

### Run the npm install

This is an npm module and can be installed as follows:

```bash
npm install --save salti

```

This sets it up for use in a NodeJS app.

### Putting the module in the Express app.

```javascript

var express = require('express'),
  http = require('http'),
  PouchDB = require('pouchdb'),
  router = express.Router();

//this tells PouchDB to use a subdirectory in the root.
var pbsetup = PouchDB.defaults({ prefix: './db/' });
var pouchPort = normalizePort(process.env.PORT2 || '3001');

//here we're using the express-pouchdb configuration for a minimal server.
var opts = {
  mode: 'minimumForPouchDB'
}

//this load the library.. 
var acllib = require('salti');

//this loads the JSON - which is an example - you're JSON can come from anywhere but should match the json schema
var acl = require('./pouchdb');

//Norml middleware usage - this adds it to the ruter...
router.all('*', acllib(acl));

//this is the express-pouchdb app - 
var pouchApp = require('express-pouchdb')(pbsetup, opts);

router.use('/', pouchApp);
app.use('/', router);

app.listen(pouchPort);

```

## JSON Schema

The ACL file follows this schema.  You can use the site [http://jeremydorn.com/json-editor/](http://jeremydorn.com/json-editor/) to manage JSON based upon any schema.

Or, use this url to manage something based upon THIS schema. [http://bit.ly/1Qs3l66](http://bit.ly/1Qs3l66).

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/",
  "type": "array",
  "items": {
    "id": "1",
    "type": "object",
    "properties": {
      "path": {
        "id": "path",
        "type": "string"
      },
      "roles": {
        "id": "roles",
        "type": "array",
        "items": {
          "id": "1",
          "type": "object",
          "properties": {
            "role": {
              "id": "role",
              "type": "string"
            },
            "verbs": {
              "id": "verbs",
              "type": "array",
              "items": {
                "id": "0",
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
}

```

### Example ACL Json

The following is an example of the JSON used for the ACL.

Note that it is a "module" that returns an Array of Objects.

#### Example single ACL

Each Object has a `path`, then a `role` that is a Array of `role.verbs`.

For example, below we have a single `path` that 'public' can issue `GET', and `user` can issue `GET` and `POST`.

```json
    "path": "/foobar",
    "roles": [{
        "role": "public",
        "verbs": ["GET"]
    }, {
        "role": "user",
        "verbs": ["GET", "POST"]
    }]
}

```
#### Example Module used in sample.

```javascript

"use strict";


module.exports =  [{
    "path": "/foobar",
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
```

