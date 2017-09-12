'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cart = mongoose.model('Cart'),
  Product = mongoose.model('Product'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cart,
  product;

/**
 * Cart routes tests
 */
describe('Cart CRUD tests P1', function () {

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

    product = new Product({
      name: 'Product Name',
      detail: 'Product Detail',
      price: 100,
      promotionprice: 80,
      percentofdiscount: 20,
      currency: '฿',
      images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982'],
      user: user
    });

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

    // Save a user to the test db and create new Cart
    user.save(function () {
      product.save(function () {
        cart = {
          items: {
            product: product,
            qty: 1,
            amount: 100,
            discount: 20,
            totalamount: 80
          },
          amount: 100,
          discount: 20,
          totalamount: 80,
          user: user
        };

        done();
      });
    });
  });

  it('should be able to save a Cart Create if logged in', function (done) {
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

        // Save a new Cart
        agent.post('/api/carts')
          .send(cart)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle Cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            var cart = cartSaveRes.body;

            (cart.title).should.equal('CART');
            (cart.cart.items.length).should.equal(1);
            done();
          });
      });
  });

  it('should be able to save a Cart Update if logged in', function (done) {
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
        var cartObj = new Cart(cart);
        cartObj.save();

        cartObj.amount = 101;
        // Save a new Cart
        agent.post('/api/carts')
          .send(cartObj)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle Cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            var cart = cartSaveRes.body;

            (cart.title).should.equal('CART');
            (cart.cart.items.length).should.equal(1);
            (cart.cart.amount).should.equal(101);

            done();
          });
      });
  });

  it('should do able to get cart by userId', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        var userId = user.id;
        var cartObj = new Cart(cart);
        cartObj.save();

        // Get a list of Carts
        agent.get('/api/cart/user/' + userId)
          .end(function (cartGetErr, cartGetRes) {
            // Handle Carts save error
            if (cartGetErr) {
              return done(cartGetErr);
            }

            // Get Carts list
            var cartData = cartGetRes.body;

            // Set assertions
            (cartData.title).should.equal('CART');
            (cartData.cart.items.length).should.equal(1);
            // Call the assertion callback
            done();
          });
      });
  });


  afterEach(function (done) {
    User.remove().exec(function () {
      Product.remove().exec(function () {
        Cart.remove().exec(done);
      });
    });
  });
});
