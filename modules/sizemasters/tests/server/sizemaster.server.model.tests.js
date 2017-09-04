'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sizemaster = mongoose.model('Sizemaster');

/**
 * Globals
 */
var user,
  sizemaster;

/**
 * Unit tests
 */
describe('Sizemaster Model Unit Tests:', function () {
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
      sizemaster = new Sizemaster({
        detail: 'US. Size',
        sizedetail: [{ name: 'S' }],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return sizemaster.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      sizemaster.detail = '';

      return sizemaster.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Sizemaster.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
