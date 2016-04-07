var express = require('express');
var router = express.Router();
var debug = require('debug')('thalisalti:replicate');
var http = require('http');

var pouchDBBase = require('pouchdb');
var PouchDB = pouchDBBase.defaults({ prefix: './db/' });

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('replicate', { title: 'Replicate' });
});

router.post('/', function (req, res, next) {
    
    debug('posted request');
    var localDB = new PouchDB('foobar')

    var pouchDbOptions = { ajax : {
        agentOptions:{
            rejectUnauthorized: false
        }            
    }};
    
    var remoteDB = new PouchDB('http://localhost:3001/foobarrepl', pouchDbOptions)

    localDB.replicate.to(remoteDB).on('complete', function () {
        debug('done replication');
    }).on('error', function (err) {
        debug('error on replication');
        debug(err);
    });

    res.render('replicate', { title: 'Replicate' });

});


router.post('/add', function (req, res, next) {
    debug('adding a new record...');
    var db = new PouchDB('foobar');
    var doc = {
        "_id": guid(),
        "name": "Mittens",
        "occupation": "kitten",
        "age": 3,
        "hobbies": [
            "playing with balls of yarn",
            "chasing laser pointers",
            "lookin' hella cute"
        ]
    };

    db.put(doc);
    debug('done a new record...');

    res.render('replicate', { title: 'Replicate' });
})


module.exports = router;
