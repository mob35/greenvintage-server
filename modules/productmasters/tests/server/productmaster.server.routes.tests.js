'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shopmaster = mongoose.model('Shopmaster'),
  Shippingmaster = mongoose.model('Shippingmaster'),
  Categorymaster = mongoose.model('Categorymaster'),
  Address = mongoose.model('Address'),
  Productmaster = mongoose.model('Productmaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  productmaster,
  shop,
  shipping,
  category,
  address;

/**
 * Productmaster routes tests
 */
describe('Productmaster CRUD tests', function () {

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
      firstname: 'firstname',
      lastname: 'lastname',
      tel: 'tel',
      address: 'address',
      subdistrict: 'subdistrict',
      district: 'district',
      province: 'province',
      postcode: 'postcode',
      user: user
    });

    shop = new Shopmaster({
      name: 'Shopmaster Name',
      detail: 'Shop detail',
      email: 'shop@email.com',
      tel: '0999999999',
      image: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg',
      map: {
        lat: '1000',
        lng: '1000'
      },
      address: [{ address: address }],
      user: user
    });

    shipping = new Shippingmaster({
      name: 'ส่งธรรมดา',
      detail: 'ส่งธรรมดาผ่านไปรษณีย์ (ฟรี)',
      days: 7,
      price: 0,
      user: user
    });

    category = new Categorymaster({
      name: 'เครื่องใช้ไฟฟ้า',
      detail: 'เครื่องใช้ไฟฟ้าในบ้าน'
    });

    // Save a user to the test db and create new Productmaster
    user.save(function () {
      address.save(function () {
        shop.save(function () {
          shipping.save(function () {
            category.save(function () {
              productmaster = {
                name: 'Productmaster name',
                price: 1234,
                image: [{
                  url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
                }],
                shop: shop,
                shippings: [{
                  shipping: shipping
                }],
                category: category,
                user: user
              };

              done();
            });
          });
        });
      });
    });
  });

  it('should be able to save a Productmaster if logged in', function (done) {
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

        // Save a new Productmaster
        agent.post('/api/productmasters')
          .send(productmaster)
          .expect(200)
          .end(function (productmasterSaveErr, productmasterSaveRes) {
            // Handle Productmaster save error
            if (productmasterSaveErr) {
              return done(productmasterSaveErr);
            }

            // Get a list of Productmasters
            agent.get('/api/productmasters')
              .end(function (productmastersGetErr, productmastersGetRes) {
                // Handle Productmasters save error
                if (productmastersGetErr) {
                  return done(productmastersGetErr);
                }

                // Get Productmasters list
                var productmasters = productmastersGetRes.body;

                // Set assertions
                (productmasters[0].user._id).should.equal(userId);
                (productmasters[0].name).should.match('Productmaster name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Productmaster if not logged in', function (done) {
    agent.post('/api/productmasters')
      .send(productmaster)
      .expect(403)
      .end(function (productmasterSaveErr, productmasterSaveRes) {
        // Call the assertion callback
        done(productmasterSaveErr);
      });
  });

  it('should not be able to save an Productmaster if no name is provided', function (done) {
    // Invalidate name field
    productmaster.name = '';

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

        // Save a new Productmaster
        agent.post('/api/productmasters')
          .send(productmaster)
          .expect(400)
          .end(function (productmasterSaveErr, productmasterSaveRes) {
            // Set message assertion
            (productmasterSaveRes.body.message).should.match('Please fill Productmaster name');

            // Handle Productmaster save error
            done(productmasterSaveErr);
          });
      });
  });

  it('should be able to update an Productmaster if signed in', function (done) {
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

        // Save a new Productmaster
        agent.post('/api/productmasters')
          .send(productmaster)
          .expect(200)
          .end(function (productmasterSaveErr, productmasterSaveRes) {
            // Handle Productmaster save error
            if (productmasterSaveErr) {
              return done(productmasterSaveErr);
            }

            // Update Productmaster name
            productmaster.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Productmaster
            agent.put('/api/productmasters/' + productmasterSaveRes.body._id)
              .send(productmaster)
              .expect(200)
              .end(function (productmasterUpdateErr, productmasterUpdateRes) {
                // Handle Productmaster update error
                if (productmasterUpdateErr) {
                  return done(productmasterUpdateErr);
                }

                // Set assertions
                (productmasterUpdateRes.body._id).should.equal(productmasterSaveRes.body._id);
                (productmasterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Productmasters if not signed in', function (done) {
    // Create new Productmaster model instance
    var productmasterObj = new Productmaster(productmaster);

    // Save the productmaster
    productmasterObj.save(function () {
      // Request Productmasters
      request(app).get('/api/productmasters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Productmaster if not signed in', function (done) {
    // Create new Productmaster model instance
    var productmasterObj = new Productmaster(productmaster);

    // Save the Productmaster
    productmasterObj.save(function () {
      request(app).get('/api/productmasters/' + productmasterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', productmaster.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Productmaster with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/productmasters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Productmaster is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Productmaster which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Productmaster
    request(app).get('/api/productmasters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Productmaster with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Productmaster if signed in', function (done) {
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

        // Save a new Productmaster
        agent.post('/api/productmasters')
          .send(productmaster)
          .expect(200)
          .end(function (productmasterSaveErr, productmasterSaveRes) {
            // Handle Productmaster save error
            if (productmasterSaveErr) {
              return done(productmasterSaveErr);
            }

            // Delete an existing Productmaster
            agent.delete('/api/productmasters/' + productmasterSaveRes.body._id)
              .send(productmaster)
              .expect(200)
              .end(function (productmasterDeleteErr, productmasterDeleteRes) {
                // Handle productmaster error error
                if (productmasterDeleteErr) {
                  return done(productmasterDeleteErr);
                }

                // Set assertions
                (productmasterDeleteRes.body._id).should.equal(productmasterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Productmaster if not signed in', function (done) {
    // Set Productmaster user
    productmaster.user = user;

    // Create new Productmaster model instance
    var productmasterObj = new Productmaster(productmaster);

    // Save the Productmaster
    productmasterObj.save(function () {
      // Try deleting Productmaster
      request(app).delete('/api/productmasters/' + productmasterObj._id)
        .expect(403)
        .end(function (productmasterDeleteErr, productmasterDeleteRes) {
          // Set message assertion
          (productmasterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Productmaster error error
          done(productmasterDeleteErr);
        });

    });
  });

  it('should be able to get a single Productmaster that has an orphaned user reference', function (done) {
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

          // Save a new Productmaster
          agent.post('/api/productmasters')
            .send(productmaster)
            .expect(200)
            .end(function (productmasterSaveErr, productmasterSaveRes) {
              // Handle Productmaster save error
              if (productmasterSaveErr) {
                return done(productmasterSaveErr);
              }

              // Set assertions on new Productmaster
              (productmasterSaveRes.body.name).should.equal(productmaster.name);
              should.exist(productmasterSaveRes.body.user);
              should.equal(productmasterSaveRes.body.user._id, orphanId);

              // force the Productmaster to have an orphaned user reference
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

                    // Get the Productmaster
                    agent.get('/api/productmasters/' + productmasterSaveRes.body._id)
                      .expect(200)
                      .end(function (productmasterInfoErr, productmasterInfoRes) {
                        // Handle Productmaster error
                        if (productmasterInfoErr) {
                          return done(productmasterInfoErr);
                        }

                        // Set assertions
                        (productmasterInfoRes.body._id).should.equal(productmasterSaveRes.body._id);
                        (productmasterInfoRes.body.name).should.equal(productmaster.name);
                        should.equal(productmasterInfoRes.body.user, undefined);

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
      Address.remove().exec(function () {
        Shopmaster.remove().exec(function () {
          Shippingmaster.remove().exec(function () {
            Categorymaster.remove().exec(function () {
              Productmaster.remove().exec(done);
            });
          });
        });
      });
    });
  });
});