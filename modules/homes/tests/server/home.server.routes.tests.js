'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Home = mongoose.model('Home'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  home;

/**
 * Home routes tests
 */
describe('Home CRUD tests', function () {

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

    // Save a user to the test db and create new Home
    user.save(function () {
      home = {
        name: 'Home name'
      };

      done();
    });
  });

  it('should be able to save a Home if logged in', function (done) {
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

        // Save a new Home
        agent.post('/api/homes')
          .send(home)
          .expect(200)
          .end(function (homeSaveErr, homeSaveRes) {
            // Handle Home save error
            if (homeSaveErr) {
              return done(homeSaveErr);
            }

            // Get a list of Homes
            agent.get('/api/homes')
              .end(function (homesGetErr, homesGetRes) {
                // Handle Homes save error
                if (homesGetErr) {
                  return done(homesGetErr);
                }

                // Get Homes list
                var homes = homesGetRes.body;

                // Set assertions
                (homes[0].user._id).should.equal(userId);
                (homes[0].name).should.match('Home name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Home if not logged in', function (done) {
    agent.post('/api/homes')
      .send(home)
      .expect(403)
      .end(function (homeSaveErr, homeSaveRes) {
        // Call the assertion callback
        done(homeSaveErr);
      });
  });

  it('should not be able to save an Home if no name is provided', function (done) {
    // Invalidate name field
    home.name = '';

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

        // Save a new Home
        agent.post('/api/homes')
          .send(home)
          .expect(400)
          .end(function (homeSaveErr, homeSaveRes) {
            // Set message assertion
            (homeSaveRes.body.message).should.match('Please fill Home name');

            // Handle Home save error
            done(homeSaveErr);
          });
      });
  });

  it('should be able to update an Home if signed in', function (done) {
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

        // Save a new Home
        agent.post('/api/homes')
          .send(home)
          .expect(200)
          .end(function (homeSaveErr, homeSaveRes) {
            // Handle Home save error
            if (homeSaveErr) {
              return done(homeSaveErr);
            }

            // Update Home name
            home.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Home
            agent.put('/api/homes/' + homeSaveRes.body._id)
              .send(home)
              .expect(200)
              .end(function (homeUpdateErr, homeUpdateRes) {
                // Handle Home update error
                if (homeUpdateErr) {
                  return done(homeUpdateErr);
                }

                // Set assertions
                (homeUpdateRes.body._id).should.equal(homeSaveRes.body._id);
                (homeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Homes if not signed in', function (done) {
    // Create new Home model instance
    var homeObj = new Home(home);

    // Save the home
    homeObj.save(function () {
      // Request Homes
      request(app).get('/api/homes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Home if not signed in', function (done) {
    // Create new Home model instance
    var homeObj = new Home(home);

    // Save the Home
    homeObj.save(function () {
      request(app).get('/api/homes/' + homeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', home.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Home with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/homes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Home is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Home which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Home
    request(app).get('/api/homes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Home with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Home if signed in', function (done) {
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

        // Save a new Home
        agent.post('/api/homes')
          .send(home)
          .expect(200)
          .end(function (homeSaveErr, homeSaveRes) {
            // Handle Home save error
            if (homeSaveErr) {
              return done(homeSaveErr);
            }

            // Delete an existing Home
            agent.delete('/api/homes/' + homeSaveRes.body._id)
              .send(home)
              .expect(200)
              .end(function (homeDeleteErr, homeDeleteRes) {
                // Handle home error error
                if (homeDeleteErr) {
                  return done(homeDeleteErr);
                }

                // Set assertions
                (homeDeleteRes.body._id).should.equal(homeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Home if not signed in', function (done) {
    // Set Home user
    home.user = user;

    // Create new Home model instance
    var homeObj = new Home(home);

    // Save the Home
    homeObj.save(function () {
      // Try deleting Home
      request(app).delete('/api/homes/' + homeObj._id)
        .expect(403)
        .end(function (homeDeleteErr, homeDeleteRes) {
          // Set message assertion
          (homeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Home error error
          done(homeDeleteErr);
        });

    });
  });

  it('should be able to get a single Home that has an orphaned user reference', function (done) {
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

          // Save a new Home
          agent.post('/api/homes')
            .send(home)
            .expect(200)
            .end(function (homeSaveErr, homeSaveRes) {
              // Handle Home save error
              if (homeSaveErr) {
                return done(homeSaveErr);
              }

              // Set assertions on new Home
              (homeSaveRes.body.name).should.equal(home.name);
              should.exist(homeSaveRes.body.user);
              should.equal(homeSaveRes.body.user._id, orphanId);

              // force the Home to have an orphaned user reference
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

                    // Get the Home
                    agent.get('/api/homes/' + homeSaveRes.body._id)
                      .expect(200)
                      .end(function (homeInfoErr, homeInfoRes) {
                        // Handle Home error
                        if (homeInfoErr) {
                          return done(homeInfoErr);
                        }

                        // Set assertions
                        (homeInfoRes.body._id).should.equal(homeSaveRes.body._id);
                        (homeInfoRes.body.name).should.equal(home.name);
                        should.equal(homeInfoRes.body.user, undefined);

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
      Home.remove().exec(done);
    });
  });
});
