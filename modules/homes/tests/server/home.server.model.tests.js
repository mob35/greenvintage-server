'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Globals
 */
var user,
  home;

/**
 * Unit tests
 */
describe('Home Model Unit Tests:', function () {
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

      done();
    });
  });

  describe('Method Save', function () {
    // it('should be able to save without problems', function(done) {
    //   this.timeout(0);
    //   return home.save(function(err) {
    //     should.not.exist(err);
    //     done();
    //   });
    // });

    // it('should be able to show an error when try to save without name', function(done) {
    //   home.name = '';

    //   return home.save(function(err) {
    //     should.exist(err);
    //     done();
    //   });
    // });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      done();
    });
  });
});
