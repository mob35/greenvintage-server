'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shopmaster = mongoose.model('Shopmaster'),
  Address = mongoose.model('Address'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  address,
  shopmaster;

/**
 * Shop routes tests
 */
describe('Shop CRUD tests', function () {

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

    address = new Address({
      firstname: user.firstName,
      lastname: user.lastName,
      tel: '0894447208',
      address: '55/7',
      subdistrict: 'บึงคำพร้อย',
      district: 'ลำลูกกา',
      province: 'ปทุมธานี',
      postcode: '12150'
    });

    // Save a user to the test db and create new Shop
    user.save(function () {
      address.save(function () {
        shopmaster = {
          name: 'Shop name',
          detail: 'detail',
          email: 'email@email.com',
          tel: '099999999',
          image: 'https://assets.wired.com/photos/w_1534/wp-content/uploads/2016/09/ff_nike-hyperadapt_angle_front.jpg',
          map: {
            lat: '1000',
            lng: '1000'
          },
          address: [{
            address: address
          }],
        };
      });


      done();
    });
  });

  it('should be able to save a Shop if logged in', function (done) {
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

        // Save a new Shop
        agent.post('/api/shops')
          .send(shopmaster)
          .expect(200)
          .end(function (shopSaveErr, shopSaveRes) {
            // Handle Shop save error
            if (shopSaveErr) {
              return done(shopSaveErr);
            }


            // Set assertions
            (shopSaveRes.body.user._id).should.equal(userId);
            (shopSaveRes.body.name).should.match('Shop name');

            // Call the assertion callback
            done();
          });
      });
  });

  it('get shop by user', function (done) {
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

        // Save a new Shop
        agent.post('/api/shops')
          .send(shopmaster)
          .expect(200)
          .end(function (shopSaveErr, shopSaveRes) {
            // Handle Shop save error
            if (shopSaveErr) {
              return done(shopSaveErr);
            }

            agent.get('/api/shops')
              .end(function (shopgetErr, shopgetRes) {
                // Handle Shop save error
                if (shopgetErr) {
                  return done(shopgetErr);
                }


                // Set assertions
                (shopgetRes.body[0].user._id).should.equal(userId);
                (shopgetRes.body[0].name).should.match('Shop name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Address.remove().exec(function () {
        Shopmaster.remove().exec(done);
      });
    });
  });
});
