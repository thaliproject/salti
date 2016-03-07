
/**
 * we define 2 distinct 'roles' (other than Admin)
 * 1. Pull Replication
 * 2. Beacon  - using a well-known PSK identity of beacon
 * All other requests are non-authenticated and purely anonymous are rejected.
 */

describe('for all roles and users - if the request is just a /', function() {
  it('should be 401 - unauthorized', function(done) {

    done();
  })
})

describe('when the user is pskIdentity = beacon', function() {
  describe('and he requests any path other than the "beacon" path', function() {
    //todo: what is the beacon path
    it('POST/GET/PUT should fail with a 401', function() {

    })
    it('IF a GET should be OK 200', function() {

    })
  })

  describe('if the user is in the Anymous role', function() {
    /**
     * Anonymous Role - NO CLEAR header or any user/identity..
     */
    it('should deny all requests', function() {

    })
  })

})

describe('when the users is in the Thali_Pull_Replication role', function() {
  describe('When the Database name is "foobar".', function() {
    describe('for the following paths and verbs', function() {
      /** https://wiki.apache.org/couchdb/HTTP_Document_API
       | Path                   | Method                  | PouchDB API |
     * |------                  |--------                 |-------------|
     * | /                      | GET                     | NA [3]    |
  ** a PUT to / is an add/update of a :db.   
  ** DB spedific paths
     * | /:db                   | GET *POST               | info |
     * ** Note missing PUT & POST^ for new records ^
     * ** a PUT adds a new document or updates existing; DELETE also; POST adds as well.
     
    ** | /:db/_all_docs         | GET, HEAD#?, POST [1]   | allDocs |
    ** | /:db/_changes          | GET, POST [2]           | changes |
     * | /:db/_bulk_get #?      | POST                    | bulkGet |
     * | /:db/_revs_diff        | POST                    | revsDiff |
  ** DB - resources
     * | /:db/:id               | GET  *PUT               | get |
     * | /:db/:id/attachment    | GET  *PUT, DELETE       | get & getAttachment |
     * 
  * * HEAD is used to retrieve basic infomration; PUT or POST can create a document, with PUT the document ID is part of the path (:id)
  * * POST to a /:db path creates a new DOC. see /:db above.
  ** What is this? **
     * | /:db/_local/thali_:id  | GET, PUT, DELETE        | get, put, remove |
     * | /:db/_local/:id 
     * 
     * :db - Substitute with the name of the DB we are protecting.
     * :id - Substitute with the ID of a document as requested over the wire.
     * thali_:id - Is an ID that begins with the prefix thali_ and otherwise
     * is just an ID.
       */


      /**
       * note: http://stackoverflow.com/questions/4038885/how-to-design-a-string-matching-algorithm-where-the-input-is-the-exact-string-an
       * https://github.com/isaacs/minimatch
       * https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm
       * https://en.wikipedia.org/wiki/String_searching_algorithm#Single_pattern_algorithms
       * http://www-igm.univ-mlv.fr/~lecroq/string/index.html
       * 
       */

    })
    describe('and the DB name and parameter is :db == foobar', function() {
      describe('and the request path IS NOT /foobar', function() {
        it('should not allow /fuzbar', function() {

        })
        it('should not allow /fuzbar/', function() {

        })
        it('should not allow /fuzbar/1', function() {

        })
      })

      describe('and the request path IS /foobar', function() {
        it('should allow GET /foobar', function() {

        })
        it('should allow GET /foobar/', function() {

        })
        it('should allow GET /foobar/1', function() {

        })
        it('should allow GET /foobar/a', function() {

        })
        it('should allow GET /foobar/a/attachment', function() {

        })
        it('should NOT allow PUT, POST /foobar', function() {

        })
        it('should NOT allow PUT, POST /foobar/', function() {

        })
        it('should NOT allow PUT, POST  /foobar/1', function() {

        })
        it('should NOT allow PUT, POST  /foobar/a', function() {

        })
        it('should NOT allow PUT, POST  /foobar/a/attachment', function() {

        })
      })
    })

  })

})


