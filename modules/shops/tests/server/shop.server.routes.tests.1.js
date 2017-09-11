'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shop = mongoose.model('Shop'),
  Review = mongoose.model('Review'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  review,
  shop;

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

    review = new Review({
      topic: 'Topic',
      comment: 'Comment',
      rate: 5
    });
    // Save a user to the test db and create new Shop
    user.save(function () {
      shop = {
        name: 'Shop name',
        detail: 'Shop Detail',
        email: 'Shop Email',
        image: 'https://www.onsite.org/assets/images/teaser/online-e-shop.jpg',
        tel: '097654321',
        map: {
          lat: '13.933954',
          long: '100.7157976'
        }
      };

      done();
    });
  });

  it('should be able to save a Shop if logged in', function (done) {
    var shopObj = new Shop(shop);
    shopObj.save(function () {
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
          var review = {
            topic: 'Topic',
            comment: 'Comment',
            rate: 5
          };
          // Save a new Shop
          agent.post('/api/shop/review/' + shopObj.id)
            .send(review)
            .expect(200)
            .end(function (shopSaveErr, shopSaveRes) {
              // Handle Shop save error
              if (shopSaveErr) {
                return done(shopSaveErr);
              }

              // Get a list of Shops
              agent.get('/api/shops/' + shopObj.id)
                .end(function (shopsGetErr, shopsGetRes) {
                  // Handle Shops save error
                  if (shopsGetErr) {
                    return done(shopsGetErr);
                  }

                  // Get Shops list
                  var shops = shopsGetRes.body;

                  // Set assertions
                  shops.should.be.instanceof(Object).and.have.property('name', shop.name);
                  shops.should.be.instanceof(Object).and.have.property('detail', shop.detail);
                  shops.should.be.instanceof(Object).and.have.property('image', shop.image);
                  shops.should.be.instanceof(Object).and.have.property('email', shop.email);
                  shops.should.be.instanceof(Object).and.have.property('tel', shop.tel);
                  shops.should.be.instanceof(Object).and.have.property('rate', 5);
                  shops.should.be.instanceof(Object).and.have.property('map', shop.map).and.have.property('lat', shop.map.lat);
                  shops.should.be.instanceof(Object).and.have.property('map', shop.map).and.have.property('long', shop.map.long);
                  shops.products.should.be.instanceof(Array).and.have.lengthOf(0);
                  shops.reviews.should.be.instanceof(Array).and.have.lengthOf(1);
                  // Call the assertion callback
                  done();
                });
            });
        });
    });

  });


  afterEach(function (done) {
    User.remove().exec(function () {
      Shop.remove().exec(done);
    });
  });
});
