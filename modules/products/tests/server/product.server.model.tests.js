'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  Favorite = mongoose.model('Favorite'),
  Shipping = mongoose.model('Shipping'),
  Review = mongoose.model('Review'),
  Shop = mongoose.model('Shop'),
  Category = mongoose.model('Category');

/**
 * Globals
 */
var user,
  product,
  favorite,
  review,
  product,
  category,
  shop,
  shipping;

/**
 * Unit tests
 */
describe('Product Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });
    favorite = new Favorite({
      user: user,
      created: new Date()
    });

    review = new Review({
      topic: 'Topic',
      comment: 'Comment',
      rate: 5
    });

    category = new Category({
      name: 'แฟชั่น'
    });

    shipping = new Shipping({
      name: 'test',
      detail: 'safdasdf',
      price: 0
    });

    shop = new Shop({
      name: 'Shop Name',
      detail: 'Shop Detail',
      email: 'Shop Email',
      image: 'https://www.onsite.org/assets/images/teaser/online-e-shop.jpg',
      tel: '097654321',
      map: {
        lat: '13.933954',
        long: '100.7157976'
      },
      reviews: [review],
      user: user
    });

    user.save(function () {
      favorite.save(function () {
        review.save(function () {
          category.save(function () {
            shipping.save(function () {
              shop.save(function () {
                product = new Product({
                  name: 'Product Name',
                  detail: 'Product Detail',
                  price: 100,
                  promotionprice: 80,
                  percentofdiscount: 20,
                  currency: '฿',
                  images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982'],
                  reviews: [review],
                  categories: [category],
                  shippings: [shipping],
                  cod: true,
                  shop: shop,
                  user: user
                });
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return product.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      product.name = '';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without price', function (done) {
      product.price = null;

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without images', function (done) {
      product.images = [];

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });


  });

  afterEach(function (done) {
    Product.remove().exec(function () {
      Shop.remove().exec(function () {
        Shipping.remove().exec(function () {
          Review.remove().exec(function () {
            Favorite.remove().exec(function () {
              Category.remove().exec(function () {
                User.remove().exec(function () {
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
