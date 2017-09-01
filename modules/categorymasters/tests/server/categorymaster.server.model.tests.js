'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categorymaster = mongoose.model('Categorymaster');

/**
 * Globals
 */
var user,
  categorymaster;

/**
 * Unit tests
 */
describe('Categorymaster Model Unit Tests:', function () {
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
      categorymaster = new Categorymaster({
        name: 'Categorymaster Name',
        detail: 'Categorymaster detail',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return categorymaster.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      categorymaster.name = '';

      return categorymaster.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without detail', function (done) {
      categorymaster.detail = '';

      return categorymaster.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function (done) {
    Categorymaster.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
