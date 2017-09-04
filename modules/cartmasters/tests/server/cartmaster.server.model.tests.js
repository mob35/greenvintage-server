'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cartmaster = mongoose.model('Cartmaster');

/**
 * Globals
 */
var user,
  cartmaster;

/**
 * Unit tests
 */
describe('Cartmaster Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      cartmaster = new Cartmaster({
        amount: 200,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return cartmaster.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Cartmaster.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
