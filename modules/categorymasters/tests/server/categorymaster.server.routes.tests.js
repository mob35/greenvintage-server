'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categorymaster = mongoose.model('Categorymaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  categorymaster;

/**
 * Categorymaster routes tests
 */
describe('Categorymaster CRUD tests', function () {

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

    // Save a user to the test db and create new Categorymaster
    user.save(function () {
      categorymaster = {
        name: 'Categorymaster name',
        detail: 'Categorymaster detail'
      };

      done();
    });
  });

  it('should be able to save a Categorymaster if logged in', function (done) {
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

        // Save a new Categorymaster
        agent.post('/api/categorymasters')
          .send(categorymaster)
          .expect(200)
          .end(function (categorymasterSaveErr, categorymasterSaveRes) {
            // Handle Categorymaster save error
            if (categorymasterSaveErr) {
              return done(categorymasterSaveErr);
            }

            // Get a list of Categorymasters
            agent.get('/api/categorymasters')
              .end(function (categorymastersGetErr, categorymastersGetRes) {
                // Handle Categorymasters save error
                if (categorymastersGetErr) {
                  return done(categorymastersGetErr);
                }

                // Get Categorymasters list
                var categorymasters = categorymastersGetRes.body;

                // Set assertions
                (categorymasters[0].user._id).should.equal(userId);
                (categorymasters[0].name).should.match('Categorymaster name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Categorymaster if not logged in', function (done) {
    agent.post('/api/categorymasters')
      .send(categorymaster)
      .expect(403)
      .end(function (categorymasterSaveErr, categorymasterSaveRes) {
        // Call the assertion callback
        done(categorymasterSaveErr);
      });
  });

  it('should not be able to save an Categorymaster if no name is provided', function (done) {
    // Invalidate name field
    categorymaster.name = '';

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

        // Save a new Categorymaster
        agent.post('/api/categorymasters')
          .send(categorymaster)
          .expect(400)
          .end(function (categorymasterSaveErr, categorymasterSaveRes) {
            // Set message assertion
            (categorymasterSaveRes.body.message).should.match('Please fill Categorymaster name');

            // Handle Categorymaster save error
            done(categorymasterSaveErr);
          });
      });
  });

  it('should be able to update an Categorymaster if signed in', function (done) {
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

        // Save a new Categorymaster
        agent.post('/api/categorymasters')
          .send(categorymaster)
          .expect(200)
          .end(function (categorymasterSaveErr, categorymasterSaveRes) {
            // Handle Categorymaster save error
            if (categorymasterSaveErr) {
              return done(categorymasterSaveErr);
            }

            // Update Categorymaster name
            categorymaster.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Categorymaster
            agent.put('/api/categorymasters/' + categorymasterSaveRes.body._id)
              .send(categorymaster)
              .expect(200)
              .end(function (categorymasterUpdateErr, categorymasterUpdateRes) {
                // Handle Categorymaster update error
                if (categorymasterUpdateErr) {
                  return done(categorymasterUpdateErr);
                }

                // Set assertions
                (categorymasterUpdateRes.body._id).should.equal(categorymasterSaveRes.body._id);
                (categorymasterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Categorymasters if not signed in', function (done) {
    // Create new Categorymaster model instance
    var categorymasterObj = new Categorymaster(categorymaster);

    // Save the categorymaster
    categorymasterObj.save(function () {
      // Request Categorymasters
      request(app).get('/api/categorymasters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Categorymaster if not signed in', function (done) {
    // Create new Categorymaster model instance
    var categorymasterObj = new Categorymaster(categorymaster);

    // Save the Categorymaster
    categorymasterObj.save(function () {
      request(app).get('/api/categorymasters/' + categorymasterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', categorymaster.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Categorymaster with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/categorymasters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Categorymaster is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Categorymaster which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Categorymaster
    request(app).get('/api/categorymasters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Categorymaster with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Categorymaster if signed in', function (done) {
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

        // Save a new Categorymaster
        agent.post('/api/categorymasters')
          .send(categorymaster)
          .expect(200)
          .end(function (categorymasterSaveErr, categorymasterSaveRes) {
            // Handle Categorymaster save error
            if (categorymasterSaveErr) {
              return done(categorymasterSaveErr);
            }

            // Delete an existing Categorymaster
            agent.delete('/api/categorymasters/' + categorymasterSaveRes.body._id)
              .send(categorymaster)
              .expect(200)
              .end(function (categorymasterDeleteErr, categorymasterDeleteRes) {
                // Handle categorymaster error error
                if (categorymasterDeleteErr) {
                  return done(categorymasterDeleteErr);
                }

                // Set assertions
                (categorymasterDeleteRes.body._id).should.equal(categorymasterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Categorymaster if not signed in', function (done) {
    // Set Categorymaster user
    categorymaster.user = user;

    // Create new Categorymaster model instance
    var categorymasterObj = new Categorymaster(categorymaster);

    // Save the Categorymaster
    categorymasterObj.save(function () {
      // Try deleting Categorymaster
      request(app).delete('/api/categorymasters/' + categorymasterObj._id)
        .expect(403)
        .end(function (categorymasterDeleteErr, categorymasterDeleteRes) {
          // Set message assertion
          (categorymasterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Categorymaster error error
          done(categorymasterDeleteErr);
        });

    });
  });

  it('should be able to get a single Categorymaster that has an orphaned user reference', function (done) {
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

          // Save a new Categorymaster
          agent.post('/api/categorymasters')
            .send(categorymaster)
            .expect(200)
            .end(function (categorymasterSaveErr, categorymasterSaveRes) {
              // Handle Categorymaster save error
              if (categorymasterSaveErr) {
                return done(categorymasterSaveErr);
              }

              // Set assertions on new Categorymaster
              (categorymasterSaveRes.body.name).should.equal(categorymaster.name);
              should.exist(categorymasterSaveRes.body.user);
              should.equal(categorymasterSaveRes.body.user._id, orphanId);

              // force the Categorymaster to have an orphaned user reference
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

                    // Get the Categorymaster
                    agent.get('/api/categorymasters/' + categorymasterSaveRes.body._id)
                      .expect(200)
                      .end(function (categorymasterInfoErr, categorymasterInfoRes) {
                        // Handle Categorymaster error
                        if (categorymasterInfoErr) {
                          return done(categorymasterInfoErr);
                        }

                        // Set assertions
                        (categorymasterInfoRes.body._id).should.equal(categorymasterSaveRes.body._id);
                        (categorymasterInfoRes.body.name).should.equal(categorymaster.name);
                        should.equal(categorymasterInfoRes.body.user, undefined);

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
      Categorymaster.remove().exec(done);
    });
  });
});
