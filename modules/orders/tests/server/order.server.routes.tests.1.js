'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  Ordermaster = mongoose.model('Ordermaster'),
  Productmaster = mongoose.model('Productmaster'),
  Categorymaster = mongoose.model('Categorymaster'),
  Shopmaster = mongoose.model('Shopmaster'),
  Address = mongoose.model('Address'),
  Shippingmaster = mongoose.model('Shippingmaster'),
  User = mongoose.model('User'),
  Cartmaster = mongoose.model('Cartmaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  product,
  address,
  shipping,
  shop,
  cart,
  category,
  order;

/**
 * Order routes tests
 */
describe('Get Order By Shop', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'getorder',
      password: 'P@ssw0rd1234'
    };

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

    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local',
      shop: shop
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

    product = new Productmaster({
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

    cart = new Cartmaster({
      products: [{
        product: product,
        itemamount: 1234,
        qty: 1
      }],
      amount: 1234,
      user: user
    });
    order = new Ordermaster({
      shipping: address,
      items: [{
        product: product,
        qty: 1,
        amount: 1234,
        size: 'S',
        delivery: shipping
      }],
      payment: {
        paymenttype: 'Counterservice',
        counterservice: '7-11'
      },
      amount: 1234,
      discount: 234,
      totalamount: 1000
    });

    // Save a user to the test db and create new Order
    user.save(function () {
      address.save(function () {
        shop.save(function () {
          shipping.save(function () {
            category.save(function () {
              product.save(function () {
                order.save(function () {
                  done();
                });
              });
            });
          });
        });
      });
    });
  });



  it(' get order by shop', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        agent.get('/api/orderlistbyshops')
          .end(function (ordersGetErr, ordersGetRes) {
            // Handle Orders save error
            if (ordersGetErr) {
              return done(ordersGetErr);
            }

            var orderbyshop = ordersGetRes.body;
            // (orderbyshop).should.equal(1);
            
            (orderbyshop.waiting.length).should.equal(1);
            (orderbyshop.waiting[0].name).should.equal(product.name);
            (orderbyshop.waiting[0].price).should.equal(product.price);
            (orderbyshop.waiting[0].qty).should.equal(order.items[0].qty);
            (orderbyshop.waiting[0].image).should.equal(product.image[0].url);
            (orderbyshop.waiting[0].status).should.equal(order.items[0].status);


            (orderbyshop.accept.length).should.equal(0);
            (orderbyshop.sent.length).should.equal(0);
            (orderbyshop.return.length).should.equal(0);

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
              Productmaster.remove().exec(function () {
                Ordermaster.remove().exec(done);
              });
            });
          });
        });
      });
    });
  });
});
