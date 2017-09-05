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
  createusershop;

/**
 * Createusershop routes tests
 */
describe('Createusershop CRUD tests', function () {

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

    // Save a user to the test db and create new Createusershop
    user.save(function () {
      createusershop = {
        name: 'Createusershop name'
      };

      done();
    });
  });

  it('should be able to save a Createusershop if logged in', function (done) {

    var user = {
      firstName: 'Full2',
      lastName: 'Name2',
      displayName: 'Full2 Name2',
      email: 'test2@test.com',
      username: 'bu4y',
      password: 'P@ssw0rd1234',
      shop: {
        name: 'Shopmaster Name2',
        detail: 'Shop detail',
        email: 'shop@email.com',
        tel: '0999999999',
        image: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }
    };

    agent.post('/api/createusershops')
      .send(user)
      .expect(200)
      .end(function (createusershopSaveErr, createusershopSaveRes) {
        // Handle Createusershop save error
        if (createusershopSaveErr) {
          return done(createusershopSaveErr);
        }

        // Get Createusershops list
        var createusershops = createusershopSaveRes.body;

        (createusershops.firstName).should.match(user.firstName);
        (createusershops.shop.name).should.match(user.shop.name);

        // Call the assertion callback
        done();
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Shopmaster.remove().exec(done);
    });
  });
});
