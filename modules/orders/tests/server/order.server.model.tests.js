'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order'),
  Address = mongoose.model('Address'),
  Product = mongoose.model('Product'),
  Shipping = mongoose.model('Shipping'),
  Payment = mongoose.model('Payment'),
  Shop = mongoose.model('Shop');

/**
 * Globals
 */
var user,
  address,
  order,
  product,
  shipping,
  payment,
  shop;


/**
 * Unit tests
 */
describe('Order Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });
    shipping = new Shipping([
      {
        shipping: {
          detail: 'วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี',
          name: 'ส่งแบบส่งด่วน',
          price: 0
        }
      },
      {
        shipping: {
          detail: 'วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี',
          name: 'ส่งแบบธรรมดา',
          price: 0
        }
      }
    ]);
    product = new Product([
      {
        product: {
          _id: '1',
          name: 'Crossfit WorldWide Event',
          image: 'https://images-eu.ssl-images-amazon.com/images/G/02/AMAZON-FASHION/2016/SHOES/SPORT/MISC/Nikemobilefootball',
          price: 20000,
          promotionprice: 18000,
          percentofdiscount: 10,
          currency: 'THB',
          shop: shop,
          shippings: [shipping]
        },
        qty: 1,
        amount: 20000,
        delivery: {
          detail: 'วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี',
          name: 'ส่งแบบส่งด่วน',
          price: 0
        },
        price: 20000,
        discount: 2000,
        afterdiscount: 18000
      },
    ]);

    shop = new Shop({
      name: 'Shop name'
    });

    address = new Address({
      address: '90',
      district: 'ลำลูกกา',
      postcode: '12150',
      province: 'ปทุมธานี',
      subdistrict: 'ลำลูกกา',
      firstname: 'amonrat',
      lastname: 'chantawon',
      tel: '0934524524'
    });
    payment = new Payment({
      paymenttype: 'credit',
      creditno: '3333333333333333',
      creditname: 'test',
      expdate: '21/02/2002',
      creditcvc: '333'
    });
    user.save(function () {
      address.save(function () {
        shipping.save(function () {
          shop.save(function () {
            payment.save(function () {
              product.save(function () {
                order = new Order({
                  // name: 'Order name',
                  shipping: address,
                  items: product,
                  payment: payment,
                  amount: 30000,
                  discount: 2000,
                  totalamount: 28000,
                  tran: 0,
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
      return order.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    // it('should be able to show an error when try to save without name', function (done) {
    //   order.name = '';

    //   return order.save(function (err) {
    //     should.exist(err);
    //     done();
    //   });
    // });
    it('should be able to show an error when try to save without shipping', function (done) {
      order.shipping = null;

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without items', function (done) {
      order.items = null;

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without amount', function (done) {
      order.amount = null;

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without discount', function (done) {
      order.discount = null;

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without totalamount', function (done) {
      order.totalamount = null;

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without tran', function (done) {
      order.tran = null;

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });
  afterEach(function (done) {
    Order.remove().exec(function () {
      Shipping.remove().exec(function () {
        Address.remove().exec(function () {
          Shop.remove().exec(function () {
            Payment.remove().exec(function () {
              Product.remove().exec(function () {
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
