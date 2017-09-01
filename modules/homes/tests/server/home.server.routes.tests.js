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
  shipping,
  category,
  address;

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
      detail: 'เครื่องใช้ไฟฟ้าในบ้าน',
      parent: '1'
    });

    // Save a user to the test db and create new Home
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

  it('should be able to save a Home if logged in', function (done) {
    var productObj = new Productmaster({
      name: 'Productmaster productObj',
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
      name: 'Productmaster productObj2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj3 = new Productmaster({
      name: 'Productmaster productObj3',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj4 = new Productmaster({
      name: 'Productmaster productObj4',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj5 = new Productmaster({
      name: 'Productmaster productObj5',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj6 = new Productmaster({
      name: 'Productmaster productObj6',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj7 = new Productmaster({
      name: 'Productmaster productObj7',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj8 = new Productmaster({
      name: 'Productmaster productObj8',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj9 = new Productmaster({
      name: 'Productmaster productObj9',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj10 = new Productmaster({
      name: 'Productmaster productObj10',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      },{
        user: user,
        date: new Date()
      }],
      category: category,
      user: user
    });
    productObj2.save();
    productObj3.save();
    productObj4.save();
    productObj5.save();
    productObj6.save();
    productObj7.save();
    productObj8.save();
    productObj9.save();
    productObj10.save();
    productObj.save(function () {
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
              (homes.categorys[0].productpopular.length).should.equal(0);

              // Call the assertion callback
              done();
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
