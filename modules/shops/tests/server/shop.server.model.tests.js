'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Review = mongoose.model('Review'),
  Shop = mongoose.model('Shop');

/**
 * Globals
 */
var user,
  review,
  shop;

/**
 * Unit tests
 */
describe('Shop Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });
    review = new Review({
      topic: 'Topic',
      comment: 'Comment',
      rate: 5
    });
    user.save(function () {
      review.save(function () {
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

        done();
      });
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return shop.save(function (err, data) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      shop.name = '';

      return shop.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Shop.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
