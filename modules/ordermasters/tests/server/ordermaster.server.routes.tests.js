'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ordermaster = mongoose.model('Ordermaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  ordermaster;

/**
 * Ordermaster routes tests
 */
describe('Ordermaster CRUD tests', function () {

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

    // Save a user to the test db and create new Ordermaster
    user.save(function () {
      ordermaster = {
        amount: 1234
      };

      done();
    });
  });

  it('should be able to save a Ordermaster if logged in', function (done) {
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

        // Save a new Ordermaster
        agent.post('/api/ordermasters')
          .send(ordermaster)
          .expect(200)
          .end(function (ordermasterSaveErr, ordermasterSaveRes) {
            // Handle Ordermaster save error
            if (ordermasterSaveErr) {
              return done(ordermasterSaveErr);
            }

            // Get a list of Ordermasters
            agent.get('/api/ordermasters')
              .end(function (ordermastersGetErr, ordermastersGetRes) {
                // Handle Ordermasters save error
                if (ordermastersGetErr) {
                  return done(ordermastersGetErr);
                }

                // Get Ordermasters list
                var ordermasters = ordermastersGetRes.body;

                // Set assertions
                (ordermasters[0].user._id).should.equal(userId);
                (ordermasters[0].amount).should.match(1234);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ordermaster if not logged in', function (done) {
    agent.post('/api/ordermasters')
      .send(ordermaster)
      .expect(403)
      .end(function (ordermasterSaveErr, ordermasterSaveRes) {
        // Call the assertion callback
        done(ordermasterSaveErr);
      });
  });

  it('should be able to update an Ordermaster if signed in', function (done) {
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

        // Save a new Ordermaster
        agent.post('/api/ordermasters')
          .send(ordermaster)
          .expect(200)
          .end(function (ordermasterSaveErr, ordermasterSaveRes) {
            // Handle Ordermaster save error
            if (ordermasterSaveErr) {
              return done(ordermasterSaveErr);
            }

            // Update Ordermaster name
            ordermaster.amount = 123;

            // Update an existing Ordermaster
            agent.put('/api/ordermasters/' + ordermasterSaveRes.body._id)
              .send(ordermaster)
              .expect(200)
              .end(function (ordermasterUpdateErr, ordermasterUpdateRes) {
                // Handle Ordermaster update error
                if (ordermasterUpdateErr) {
                  return done(ordermasterUpdateErr);
                }

                // Set assertions
                (ordermasterUpdateRes.body._id).should.equal(ordermasterSaveRes.body._id);
                (ordermasterUpdateRes.body.amount).should.match(123);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ordermasters if not signed in', function (done) {
    // Create new Ordermaster model instance
    var ordermasterObj = new Ordermaster(ordermaster);

    // Save the ordermaster
    ordermasterObj.save(function () {
      // Request Ordermasters
      request(app).get('/api/ordermasters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ordermaster if not signed in', function (done) {
    // Create new Ordermaster model instance
    var ordermasterObj = new Ordermaster(ordermaster);

    // Save the Ordermaster
    ordermasterObj.save(function () {
      request(app).get('/api/ordermasters/' + ordermasterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('amount', ordermaster.amount);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ordermaster with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ordermasters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ordermaster is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ordermaster which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ordermaster
    request(app).get('/api/ordermasters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ordermaster with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ordermaster if signed in', function (done) {
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

        // Save a new Ordermaster
        agent.post('/api/ordermasters')
          .send(ordermaster)
          .expect(200)
          .end(function (ordermasterSaveErr, ordermasterSaveRes) {
            // Handle Ordermaster save error
            if (ordermasterSaveErr) {
              return done(ordermasterSaveErr);
            }

            // Delete an existing Ordermaster
            agent.delete('/api/ordermasters/' + ordermasterSaveRes.body._id)
              .send(ordermaster)
              .expect(200)
              .end(function (ordermasterDeleteErr, ordermasterDeleteRes) {
                // Handle ordermaster error error
                if (ordermasterDeleteErr) {
                  return done(ordermasterDeleteErr);
                }

                // Set assertions
                (ordermasterDeleteRes.body._id).should.equal(ordermasterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ordermaster if not signed in', function (done) {
    // Set Ordermaster user
    ordermaster.user = user;

    // Create new Ordermaster model instance
    var ordermasterObj = new Ordermaster(ordermaster);

    // Save the Ordermaster
    ordermasterObj.save(function () {
      // Try deleting Ordermaster
      request(app).delete('/api/ordermasters/' + ordermasterObj._id)
        .expect(403)
        .end(function (ordermasterDeleteErr, ordermasterDeleteRes) {
          // Set message assertion
          (ordermasterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ordermaster error error
          done(ordermasterDeleteErr);
        });

    });
  });

  it('should be able to get a single Ordermaster that has an orphaned user reference', function (done) {
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

          // Save a new Ordermaster
          agent.post('/api/ordermasters')
            .send(ordermaster)
            .expect(200)
            .end(function (ordermasterSaveErr, ordermasterSaveRes) {
              // Handle Ordermaster save error
              if (ordermasterSaveErr) {
                return done(ordermasterSaveErr);
              }

              // Set assertions on new Ordermaster
              (ordermasterSaveRes.body.amount).should.equal(ordermaster.amount);
              should.exist(ordermasterSaveRes.body.user);
              should.equal(ordermasterSaveRes.body.user._id, orphanId);

              // force the Ordermaster to have an orphaned user reference
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

                    // Get the Ordermaster
                    agent.get('/api/ordermasters/' + ordermasterSaveRes.body._id)
                      .expect(200)
                      .end(function (ordermasterInfoErr, ordermasterInfoRes) {
                        // Handle Ordermaster error
                        if (ordermasterInfoErr) {
                          return done(ordermasterInfoErr);
                        }

                        // Set assertions
                        (ordermasterInfoRes.body._id).should.equal(ordermasterSaveRes.body._id);
                        (ordermasterInfoRes.body.amount).should.equal(ordermaster.amount);
                        should.equal(ordermasterInfoRes.body.user, undefined);

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
      Ordermaster.remove().exec(done);
    });
  });
});
