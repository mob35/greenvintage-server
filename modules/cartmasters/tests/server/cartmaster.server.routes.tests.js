'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cartmaster = mongoose.model('Cartmaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cartmaster;

/**
 * Cartmaster routes tests
 */
describe('Cartmaster CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Cartmaster
    user.save(function () {
      cartmaster = {
        amount: 200
      };

      done();
    });
  });

  it('should be able to save a Cartmaster if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cartmaster
        agent.post('/api/cartmasters')
          .send(cartmaster)
          .expect(200)
          .end(function (cartmasterSaveErr, cartmasterSaveRes) {
            // Handle Cartmaster save error
            if (cartmasterSaveErr) {
              return done(cartmasterSaveErr);
            }

            // Get a list of Cartmasters
            agent.get('/api/cartmasters')
              .end(function (cartmastersGetErr, cartmastersGetRes) {
                // Handle Cartmasters save error
                if (cartmastersGetErr) {
                  return done(cartmastersGetErr);
                }

                // Get Cartmasters list
                var cartmasters = cartmastersGetRes.body;

                // Set assertions
                (cartmasters[0].user._id).should.equal(userId);
                (cartmasters[0].amount).should.match(200);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Cartmaster if not logged in', function (done) {
    agent.post('/api/cartmasters')
      .send(cartmaster)
      .expect(403)
      .end(function (cartmasterSaveErr, cartmasterSaveRes) {
        // Call the assertion callback
        done(cartmasterSaveErr);
      });
  });

  it('should be able to update an Cartmaster if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cartmaster
        agent.post('/api/cartmasters')
          .send(cartmaster)
          .expect(200)
          .end(function (cartmasterSaveErr, cartmasterSaveRes) {
            // Handle Cartmaster save error
            if (cartmasterSaveErr) {
              return done(cartmasterSaveErr);
            }

            // Update Cartmaster name
            cartmaster.amount = 300;

            // Update an existing Cartmaster
            agent.put('/api/cartmasters/' + cartmasterSaveRes.body._id)
              .send(cartmaster)
              .expect(200)
              .end(function (cartmasterUpdateErr, cartmasterUpdateRes) {
                // Handle Cartmaster update error
                if (cartmasterUpdateErr) {
                  return done(cartmasterUpdateErr);
                }

                // Set assertions
                (cartmasterUpdateRes.body._id).should.equal(cartmasterSaveRes.body._id);
                (cartmasterUpdateRes.body.amount).should.match(300);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cartmasters if not signed in', function (done) {
    // Create new Cartmaster model instance
    var cartmasterObj = new Cartmaster(cartmaster);

    // Save the cartmaster
    cartmasterObj.save(function () {
      // Request Cartmasters
      request(app).get('/api/cartmasters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Cartmaster if not signed in', function (done) {
    // Create new Cartmaster model instance
    var cartmasterObj = new Cartmaster(cartmaster);

    // Save the Cartmaster
    cartmasterObj.save(function () {
      request(app).get('/api/cartmasters/' + cartmasterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('amount', cartmaster.amount);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Cartmaster with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cartmasters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cartmaster is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Cartmaster which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Cartmaster
    request(app).get('/api/cartmasters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Cartmaster with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Cartmaster if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cartmaster
        agent.post('/api/cartmasters')
          .send(cartmaster)
          .expect(200)
          .end(function (cartmasterSaveErr, cartmasterSaveRes) {
            // Handle Cartmaster save error
            if (cartmasterSaveErr) {
              return done(cartmasterSaveErr);
            }

            // Delete an existing Cartmaster
            agent.delete('/api/cartmasters/' + cartmasterSaveRes.body._id)
              .send(cartmaster)
              .expect(200)
              .end(function (cartmasterDeleteErr, cartmasterDeleteRes) {
                // Handle cartmaster error error
                if (cartmasterDeleteErr) {
                  return done(cartmasterDeleteErr);
                }

                // Set assertions
                (cartmasterDeleteRes.body._id).should.equal(cartmasterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Cartmaster if not signed in', function (done) {
    // Set Cartmaster user
    cartmaster.user = user;

    // Create new Cartmaster model instance
    var cartmasterObj = new Cartmaster(cartmaster);

    // Save the Cartmaster
    cartmasterObj.save(function () {
      // Try deleting Cartmaster
      request(app).delete('/api/cartmasters/' + cartmasterObj._id)
        .expect(403)
        .end(function (cartmasterDeleteErr, cartmasterDeleteRes) {
          // Set message assertion
          (cartmasterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Cartmaster error error
          done(cartmasterDeleteErr);
        });

    });
  });

  it('should be able to get a single Cartmaster that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Cartmaster
          agent.post('/api/cartmasters')
            .send(cartmaster)
            .expect(200)
            .end(function (cartmasterSaveErr, cartmasterSaveRes) {
              // Handle Cartmaster save error
              if (cartmasterSaveErr) {
                return done(cartmasterSaveErr);
              }

              // Set assertions on new Cartmaster
              (cartmasterSaveRes.body.amount).should.equal(cartmaster.amount);
              should.exist(cartmasterSaveRes.body.user);
              should.equal(cartmasterSaveRes.body.user._id, orphanId);

              // force the Cartmaster to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Cartmaster
                    agent.get('/api/cartmasters/' + cartmasterSaveRes.body._id)
                      .expect(200)
                      .end(function (cartmasterInfoErr, cartmasterInfoRes) {
                        // Handle Cartmaster error
                        if (cartmasterInfoErr) {
                          return done(cartmasterInfoErr);
                        }

                        // Set assertions
                        (cartmasterInfoRes.body._id).should.equal(cartmasterSaveRes.body._id);
                        (cartmasterInfoRes.body.amount).should.equal(cartmaster.amount);
                        should.equal(cartmasterInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Cartmaster.remove().exec(done);
    });
  });
});
