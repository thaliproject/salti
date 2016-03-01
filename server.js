/* jshint node: true */
'use strict';

var express = require('express'),
    app     = express(),
    PouchDB = require('pouchdb'),
    router = express.Router();

var pbsetup = PouchDB.defaults({prefix: './db/'});

var opts = {
  mode: 'minimumForPouchDB',
  overrideMode: {
    include: ['routes/fauxton']
  }
}

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.all('*', function(req, res, next) {
  console.log('one: %s %s %s', req.method, req.url, req.path);
  dumpRoutes(req.app);
  console.log((req.connection));
  next();
});

var it = require('express-pouchdb')(pbsetup, opts);

router.use('/db', it);
app.use('/', router); 

var route, routes = [];


function dumpRoutes (app){
app._router.stack.forEach(function(middleware){
    if(middleware.route){ // routes registered directly on the app
        routes.push(middleware.route);
    } else if(middleware.name === 'router'){ // router middleware 
        middleware.handle.stack.forEach(function(handler){
            route = handler.route;
            route && routes.push(route);
        });
    }
});

console.log(JSON.stringify(routes));

}
app.listen(3000);

