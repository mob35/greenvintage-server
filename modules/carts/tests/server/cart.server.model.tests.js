'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cart = mongoose.model('Cart'),
  Product = mongoose.model('Product');


/**
 * Globals
 */
var user,
  cart,
  product;

/**
 * Unit tests
 */
describe('Cart Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

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

    user.save(function () {
      product.save(function () {
        cart = new Cart({
          items: {
            product: product,
            qty: 1,
            amount: 100,
            discount: 20,
            totalamount: 80
          },
          amount: 100,
          discount: 20,
          totalamount: 80
        });
        done();
      });
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return cart.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Cart.remove().exec(function () {
      Product.remove().exec(function () {
        User.remove().exec(function () {
          done();
        });
      });
    });
  });
});
