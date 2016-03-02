/* jshint node: true */
'use strict';

var express = require('express'),
  app = express(),
  PouchDB = require('pouchdb'),
  router = express.Router();

var pbsetup = PouchDB.defaults({ prefix: './db/' });

var opts = {
  mode: 'minimumForPouchDB',
  overrideMode: {
    include: ['routes/fauxton']
  }
}

var acllib = require('../lib/index');
var acl = require('../lib/pouchdb');
//Norml middleware usage..
router.all('*', acllib(acl));

var pouchApp = require('express-pouchdb')(pbsetup, opts);

router.use('/', pouchApp);
app.use('/', router);

app.listen(process.env.PORT || 3000);

