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
  product,
  shop,
  shop2,
  shipping,
  category,
  category2,
  address;

/**
 * Product routes tests
 */
describe('Product CRUD tests', function () {

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

    shop2 = new Shopmaster({
      name: 'Shopmaster Name2',
      detail: 'Shop detail',
      email: 'shop2@email.com',
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

    category2 = new Categorymaster({
      name: 'กีฬา',
      detail: 'sport'
    });

    // Save a user to the test db and create new Product
    user.save(function () {
      address.save(function () {
        shop.save(function () {
          shipping.save(function () {
            category.save(function () {
              product = {
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

  it('should be able to save a Product if logged in', function (done) {
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

        // Save a new Product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function (productSaveErr, productSaveRes) {
            // Handle Product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }
            // Set assertions
            (productSaveRes.body.user._id).should.equal(userId);
            (productSaveRes.body.name).should.match('Productmaster name');

            done();
          });
      });
  });

  it('get category all shop all', function (done) {
    var productObj1 = new Productmaster({
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
    });

    var productObj2 = new Productmaster({
      name: 'Productmaster name2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      category: category2,
      user: user
    });
    productObj1.save();
    productObj2.save();
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

        // Save a new Product
        agent.get('/api/productsbycategorybyshop/all/all')
          .end(function (productGetErr, productGetRes) {
            // Handle Product save error
            if (productGetErr) {
              return done(productGetErr);
            }
            // Set assertions
            (productGetRes.body.length).should.equal(2);

            done();
          });
      });
  });

  it('get category id shop all', function (done) {
    var productObj1 = new Productmaster({
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
    });

    var productObj2 = new Productmaster({
      name: 'Productmaster name2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      category: category2,
      user: user
    });
    productObj1.save();
    productObj2.save();
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

        // Save a new Product
        agent.get('/api/productsbycategorybyshop/' + category.id + '/all')
          .end(function (productGetErr, productGetRes) {
            // Handle Product save error
            if (productGetErr) {
              return done(productGetErr);
            }
            // Set assertions
            (productGetRes.body.length).should.equal(1);

            done();
          });
      });
  });

  it('get category all shop id', function (done) {
    var productObj1 = new Productmaster({
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
    });

    var productObj2 = new Productmaster({
      name: 'Productmaster name2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      category: category2,
      user: user
    });
    productObj1.save();
    productObj2.save();
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

        // Save a new Product
        agent.get('/api/productsbycategorybyshop/all/' + shop.id)
          .end(function (productGetErr, productGetRes) {
            // Handle Product save error
            if (productGetErr) {
              return done(productGetErr);
            }
            // Set assertions
            (productGetRes.body.length).should.equal(1);
            (productGetRes.body[0].shop._id).should.equal(shop.id);

            done();
          });
      });
  });

  it('get category id shop id have item', function (done) {
    var productObj1 = new Productmaster({
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
    });

    var productObj2 = new Productmaster({
      name: 'Productmaster name2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      category: category2,
      user: user
    });
    productObj1.save();
    productObj2.save();
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

        // Save a new Product
        agent.get('/api/productsbycategorybyshop/' + category.id + '/' + shop.id)
          .end(function (productGetErr, productGetRes) {
            // Handle Product save error
            if (productGetErr) {
              return done(productGetErr);
            }
            // Set assertions
            (productGetRes.body.length).should.equal(1);
            (productGetRes.body[0].shop._id).should.equal(shop.id);
            (productGetRes.body[0].category._id).should.equal(category.id);

            done();
          });
      });
  });

  it('get category id shop id not have item', function (done) {
    var productObj1 = new Productmaster({
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
    });

    var productObj2 = new Productmaster({
      name: 'Productmaster name2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      category: category2,
      user: user
    });
    productObj1.save();
    productObj2.save();
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

        // Save a new Product
        agent.get('/api/productsbycategorybyshop/' + category2.id + '/' + shop.id)
          .end(function (productGetErr, productGetRes) {
            // Handle Product save error
            if (productGetErr) {
              return done(productGetErr);
            }
            // Set assertions
            (productGetRes.body.length).should.equal(0);

            done();
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
