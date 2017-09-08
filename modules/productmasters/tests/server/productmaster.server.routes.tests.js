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
  Sizemaster = mongoose.model('Sizemaster'),
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
  sizemaster,
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
      firstname: 'dook',
      lastname: 'dik',
      tel: '0961345046',
      address: '6/203',
      subdistrict: 'paholyothin52',
      district: 'saimai',
      province: 'bangkok',
      postcode: '10220',
      user: user
    });

    shop = new Shopmaster({
      name: 'Apple Shop',
      detail: 'Shop detail',
      email: 'shop@email.com',
      tel: '0999999999',
      image: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg',
      map: {
        lat: '13.45345345',
        lng: '100.4343500'
      },
      address: [{ address: address }],
      user: user
    });

    shipping = new Shippingmaster({
      name: 'EMS',
      detail: 'EMS register',
      days: 2,
      price: 39,
      user: user
    });

    category = new Categorymaster({
      name: 'electonic',
      detail: 'home electonic'
    });

    sizemaster = new Sizemaster({
      detail: 'America Size',
      sizedetail: ['32', '33', '34', '35'],
      user: user
    });

    productmaster = new Productmaster({
      name: 'Apple',
      detail: 'product detail',
      price: 999,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      preparedays: 7,
      favorite: [{
        user: user
      }],
      historylog: [{
        user: user
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      issize: true,
      size: size,
      sellerlog: [{
        user: user,
        qty: 9
      }],
      category: category,
      user: user
    });

    user.save(function () {
      address.save(function () {
        shop.save(function () {
          shipping.save(function () {
            category.save(function () {
              sizemaster.save(function () {
                done();
              });
            });
          });
        });
      });
    });
  });

  it('should be able to save a Productmaster if logged in', function (done) {

    productmaster.save(function (err, result) {
      console.log('=======================PRODUCT SAVE===================');
      console.log(result);
      console.log('=================================================');
      agent.get('/api/productmasters/'+ result._id)
      .end(function (productmastersGetErr, productmastersGetRes) {

        if (productmastersGetErr) {
          return done(productmastersGetErr);
        }

        console.log('=======================PRODUCT GET BY ID============');
        console.log(productmastersGetRes.body);
        console.log('=================================================');

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
              Sizemaster.remove().exec(function () {
                Productmaster.remove().exec(function () {
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});