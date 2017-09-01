'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shopmaster = mongoose.model('Shopmaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  shopmaster;

/**
 * Shopmaster routes tests
 */
describe('Shopmaster CRUD tests', function () {

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

    // Save a user to the test db and create new Shopmaster
    user.save(function () {
      shopmaster = {
        name: 'Shopmaster name'
      };

      done();
    });
  });

  it('should be able to save a Shopmaster if logged in', function (done) {
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

        // Save a new Shopmaster
        agent.post('/api/shopmasters')
          .send(shopmaster)
          .expect(200)
          .end(function (shopmasterSaveErr, shopmasterSaveRes) {
            // Handle Shopmaster save error
            if (shopmasterSaveErr) {
              return done(shopmasterSaveErr);
            }

            // Get a list of Shopmasters
            agent.get('/api/shopmasters')
              .end(function (shopmastersGetErr, shopmastersGetRes) {
                // Handle Shopmasters save error
                if (shopmastersGetErr) {
                  return done(shopmastersGetErr);
                }

                // Get Shopmasters list
                var shopmasters = shopmastersGetRes.body;

                // Set assertions
                (shopmasters[0].user._id).should.equal(userId);
                (shopmasters[0].name).should.match('Shopmaster name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Shopmaster if not logged in', function (done) {
    agent.post('/api/shopmasters')
      .send(shopmaster)
      .expect(403)
      .end(function (shopmasterSaveErr, shopmasterSaveRes) {
        // Call the assertion callback
        done(shopmasterSaveErr);
      });
  });

  it('should not be able to save an Shopmaster if no name is provided', function (done) {
    // Invalidate name field
    shopmaster.name = '';

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

        // Save a new Shopmaster
        agent.post('/api/shopmasters')
          .send(shopmaster)
          .expect(400)
          .end(function (shopmasterSaveErr, shopmasterSaveRes) {
            // Set message assertion
            (shopmasterSaveRes.body.message).should.match('Please fill Shopmaster name');

            // Handle Shopmaster save error
            done(shopmasterSaveErr);
          });
      });
  });

  it('should be able to update an Shopmaster if signed in', function (done) {
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

        // Save a new Shopmaster
        agent.post('/api/shopmasters')
          .send(shopmaster)
          .expect(200)
          .end(function (shopmasterSaveErr, shopmasterSaveRes) {
            // Handle Shopmaster save error
            if (shopmasterSaveErr) {
              return done(shopmasterSaveErr);
            }

            // Update Shopmaster name
            shopmaster.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Shopmaster
            agent.put('/api/shopmasters/' + shopmasterSaveRes.body._id)
              .send(shopmaster)
              .expect(200)
              .end(function (shopmasterUpdateErr, shopmasterUpdateRes) {
                // Handle Shopmaster update error
                if (shopmasterUpdateErr) {
                  return done(shopmasterUpdateErr);
                }

                // Set assertions
                (shopmasterUpdateRes.body._id).should.equal(shopmasterSaveRes.body._id);
                (shopmasterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Shopmasters if not signed in', function (done) {
    // Create new Shopmaster model instance
    var shopmasterObj = new Shopmaster(shopmaster);

    // Save the shopmaster
    shopmasterObj.save(function () {
      // Request Shopmasters
      request(app).get('/api/shopmasters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Shopmaster if not signed in', function (done) {
    // Create new Shopmaster model instance
    var shopmasterObj = new Shopmaster(shopmaster);

    // Save the Shopmaster
    shopmasterObj.save(function () {
      request(app).get('/api/shopmasters/' + shopmasterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', shopmaster.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Shopmaster with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/shopmasters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Shopmaster is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Shopmaster which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Shopmaster
    request(app).get('/api/shopmasters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Shopmaster with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Shopmaster if signed in', function (done) {
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

        // Save a new Shopmaster
        agent.post('/api/shopmasters')
          .send(shopmaster)
          .expect(200)
          .end(function (shopmasterSaveErr, shopmasterSaveRes) {
            // Handle Shopmaster save error
            if (shopmasterSaveErr) {
              return done(shopmasterSaveErr);
            }

            // Delete an existing Shopmaster
            agent.delete('/api/shopmasters/' + shopmasterSaveRes.body._id)
              .send(shopmaster)
              .expect(200)
              .end(function (shopmasterDeleteErr, shopmasterDeleteRes) {
                // Handle shopmaster error error
                if (shopmasterDeleteErr) {
                  return done(shopmasterDeleteErr);
                }

                // Set assertions
                (shopmasterDeleteRes.body._id).should.equal(shopmasterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Shopmaster if not signed in', function (done) {
    // Set Shopmaster user
    shopmaster.user = user;

    // Create new Shopmaster model instance
    var shopmasterObj = new Shopmaster(shopmaster);

    // Save the Shopmaster
    shopmasterObj.save(function () {
      // Try deleting Shopmaster
      request(app).delete('/api/shopmasters/' + shopmasterObj._id)
        .expect(403)
        .end(function (shopmasterDeleteErr, shopmasterDeleteRes) {
          // Set message assertion
          (shopmasterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Shopmaster error error
          done(shopmasterDeleteErr);
        });

    });
  });

  it('should be able to get a single Shopmaster that has an orphaned user reference', function (done) {
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

          // Save a new Shopmaster
          agent.post('/api/shopmasters')
            .send(shopmaster)
            .expect(200)
            .end(function (shopmasterSaveErr, shopmasterSaveRes) {
              // Handle Shopmaster save error
              if (shopmasterSaveErr) {
                return done(shopmasterSaveErr);
              }

              // Set assertions on new Shopmaster
              (shopmasterSaveRes.body.name).should.equal(shopmaster.name);
              should.exist(shopmasterSaveRes.body.user);
              should.equal(shopmasterSaveRes.body.user._id, orphanId);

              // force the Shopmaster to have an orphaned user reference
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

                    // Get the Shopmaster
                    agent.get('/api/shopmasters/' + shopmasterSaveRes.body._id)
                      .expect(200)
                      .end(function (shopmasterInfoErr, shopmasterInfoRes) {
                        // Handle Shopmaster error
                        if (shopmasterInfoErr) {
                          return done(shopmasterInfoErr);
                        }

                        // Set assertions
                        (shopmasterInfoRes.body._id).should.equal(shopmasterSaveRes.body._id);
                        (shopmasterInfoRes.body.name).should.equal(shopmaster.name);
                        should.equal(shopmasterInfoRes.body.user, undefined);

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
      Shopmaster.remove().exec(done);
    });
  });
});
