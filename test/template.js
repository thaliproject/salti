/* 

describe('{}}', function() {
  describe(' - {}}', function() {
    var app, router; app = express(); router = express.Router();

    before(function() {
      //mocker..
      router.all('*', function(req, res, next) {
        //req.connection.pskIdentity = 'public';//not adding any identity for faking.
        next();
      })
      //Norml middleware usage..
      //router.all('*', lib([{}]));
      //mock handlers  
      app.use('/', genericHandlers(router));
    })
    it('should be {}}', function(done) {
      request(app)
        .get('/')
        .send({ email: 'test@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect(200, done);
    })
  })
})

*/