'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sizemaster = mongoose.model('Sizemaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sizemaster;

/**
 * Sizemaster routes tests
 */
describe('Sizemaster CRUD tests', function () {

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

    // Save a user to the test db and create new Sizemaster
    user.save(function () {
      sizemaster = {
        detail: 'US',
        sizedetail: [
          { 
            name: 'S' 
          },{ 
            name: 'M' 
          },{ 
            name: 'L' 
          },{ 
            name: 'XL' 
          }
        ],
        user: user
      };

      done();
    });
  });

  it('should be able to save a Sizemaster if logged in', function (done) {
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

        // Save a new Sizemaster
        agent.post('/api/sizemasters')
          .send(sizemaster)
          .expect(200)
          .end(function (sizemasterSaveErr, sizemasterSaveRes) {
            // Handle Sizemaster save error
            if (sizemasterSaveErr) {
              return done(sizemasterSaveErr);
            }

            // Get a list of Sizemasters
            agent.get('/api/sizemasters')
              .end(function (sizemastersGetErr, sizemastersGetRes) {
                // Handle Sizemasters save error
                if (sizemastersGetErr) {
                  return done(sizemastersGetErr);
                }

                // Get Sizemasters list
                var sizemasters = sizemastersGetRes.body;

                // Set assertions
                (sizemasters[0].user._id).should.equal(userId);
                (sizemasters[0].detail).should.match('US');
                (sizemasters[0].sizedetail[0].name).should.match('S');
                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sizemaster if not logged in', function (done) {
    agent.post('/api/sizemasters')
      .send(sizemaster)
      .expect(403)
      .end(function (sizemasterSaveErr, sizemasterSaveRes) {
        // Call the assertion callback
        done(sizemasterSaveErr);
      });
  });

  it('should not be able to save an Sizemaster if no detail is provided', function (done) {
    // Invalidate name field
    sizemaster.detail = '';
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

        // Save a new Sizemaster
        agent.post('/api/sizemasters')
          .send(sizemaster)
          .expect(400)
          .end(function (sizemasterSaveErr, sizemasterSaveRes) {
            // Set message assertion
            (sizemasterSaveRes.body.message).should.match('Please fill detail size');

            // Handle Sizemaster save error
            done(sizemasterSaveErr);
          });
      });
  });

  it('should not be able to save an Sizemaster if no sizedetail name is provided', function (done) {
    // Invalidate name field
    sizemaster.sizedetail[0].name = '';
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

        // Save a new Sizemaster
        agent.post('/api/sizemasters')
          .send(sizemaster)
          .expect(400)
          .end(function (sizemasterSaveErr, sizemasterSaveRes) {
            // Set message assertion
            (sizemasterSaveRes.body.message).should.match('Please fill size detail name');
            // Handle Sizemaster save error
            done(sizemasterSaveErr);
          });
      });
  });

  it('should be able to update an Sizemaster if signed in', function (done) {
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

        // Save a new Sizemaster
        agent.post('/api/sizemasters')
          .send(sizemaster)
          .expect(200)
          .end(function (sizemasterSaveErr, sizemasterSaveRes) {
            // Handle Sizemaster save error
            if (sizemasterSaveErr) {
              return done(sizemasterSaveErr);
            }

            // Update Sizemaster name
            sizemaster.detail = 'US. Size';
            sizemaster.sizedetail[0].name = 'XXX';
            // Update an existing Sizemaster
            agent.put('/api/sizemasters/' + sizemasterSaveRes.body._id)
              .send(sizemaster)
              .expect(200)
              .end(function (sizemasterUpdateErr, sizemasterUpdateRes) {
                // Handle Sizemaster update error
                if (sizemasterUpdateErr) {
                  return done(sizemasterUpdateErr);
                }

                // Set assertions
                (sizemasterUpdateRes.body._id).should.equal(sizemasterSaveRes.body._id);
                (sizemasterUpdateRes.body.detail).should.match('US. Size');
                (sizemasterUpdateRes.body.sizedetail[0].name).should.match('XXX');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sizemasters if not signed in', function (done) {
    // Create new Sizemaster model instance
    var sizemasterObj = new Sizemaster(sizemaster);

    // Save the sizemaster
    sizemasterObj.save(function () {
      // Request Sizemasters
      request(app).get('/api/sizemasters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sizemaster if not signed in', function (done) {
    // Create new Sizemaster model instance
    var sizemasterObj = new Sizemaster(sizemaster);

    // Save the Sizemaster
    sizemasterObj.save(function () {
      request(app).get('/api/sizemasters/' + sizemasterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('detail', sizemaster.detail);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sizemaster with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sizemasters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sizemaster is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sizemaster which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sizemaster
    request(app).get('/api/sizemasters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sizemaster with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sizemaster if signed in', function (done) {
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

        // Save a new Sizemaster
        agent.post('/api/sizemasters')
          .send(sizemaster)
          .expect(200)
          .end(function (sizemasterSaveErr, sizemasterSaveRes) {
            // Handle Sizemaster save error
            if (sizemasterSaveErr) {
              return done(sizemasterSaveErr);
            }

            // Delete an existing Sizemaster
            agent.delete('/api/sizemasters/' + sizemasterSaveRes.body._id)
              .send(sizemaster)
              .expect(200)
              .end(function (sizemasterDeleteErr, sizemasterDeleteRes) {
                // Handle sizemaster error error
                if (sizemasterDeleteErr) {
                  return done(sizemasterDeleteErr);
                }

                // Set assertions
                (sizemasterDeleteRes.body._id).should.equal(sizemasterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sizemaster if not signed in', function (done) {
    // Set Sizemaster user
    sizemaster.user = user;

    // Create new Sizemaster model instance
    var sizemasterObj = new Sizemaster(sizemaster);

    // Save the Sizemaster
    sizemasterObj.save(function () {
      // Try deleting Sizemaster
      request(app).delete('/api/sizemasters/' + sizemasterObj._id)
        .expect(403)
        .end(function (sizemasterDeleteErr, sizemasterDeleteRes) {
          // Set message assertion
          (sizemasterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sizemaster error error
          done(sizemasterDeleteErr);
        });

    });
  });

  it('should be able to get a single Sizemaster that has an orphaned user reference', function (done) {
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

          // Save a new Sizemaster
          agent.post('/api/sizemasters')
            .send(sizemaster)
            .expect(200)
            .end(function (sizemasterSaveErr, sizemasterSaveRes) {
              // Handle Sizemaster save error
              if (sizemasterSaveErr) {
                return done(sizemasterSaveErr);
              }

              // Set assertions on new Sizemaster
              (sizemasterSaveRes.body.detail).should.equal(sizemaster.detail);
              should.exist(sizemasterSaveRes.body.user);
              should.equal(sizemasterSaveRes.body.user._id, orphanId);

              // force the Sizemaster to have an orphaned user reference
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

                    // Get the Sizemaster
                    agent.get('/api/sizemasters/' + sizemasterSaveRes.body._id)
                      .expect(200)
                      .end(function (sizemasterInfoErr, sizemasterInfoRes) {
                        // Handle Sizemaster error
                        if (sizemasterInfoErr) {
                          return done(sizemasterInfoErr);
                        }

                        // Set assertions
                        (sizemasterInfoRes.body._id).should.equal(sizemasterSaveRes.body._id);
                        (sizemasterInfoRes.body.detail).should.equal(sizemaster.detail);
                        should.equal(sizemasterInfoRes.body.user, undefined);

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
      Sizemaster.remove().exec(done);
    });
  });
});
