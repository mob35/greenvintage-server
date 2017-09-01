'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shopmaster = mongoose.model('Shopmaster'),
  Shippingmaster = mongoose.model('Shippingmaster'),
  Categorymaster = mongoose.model('Categorymaster'),
  Address = mongoose.model('Address'),
  Productmaster = mongoose.model('Productmaster');

/**
 * Globals
 */
var user,
  productmaster,
  shop,
  shipping,
  category,
  address;

/**
 * Unit tests
 */
describe('Productmaster Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
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
      detail: 'เครื่องใช้ไฟฟ้าในบ้าน'
    });


    user.save(function () {
      address.save(function () {
        shop.save(function () {
          shipping.save(function () {
            category.save(function () {
              productmaster = new Productmaster({
                name: 'Productmaster Name',
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

              done();
            });
          });
        });
      });
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return productmaster.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      productmaster.name = '';

      return productmaster.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Productmaster.remove().exec(function () {
      Categorymaster.remove().exec(function () {
        Shippingmaster.remove().exec(function () {
          Shopmaster.remove().exec(function () {
            Address.remove().exec(function () {
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
