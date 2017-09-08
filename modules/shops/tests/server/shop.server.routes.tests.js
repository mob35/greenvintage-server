'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shippingmaster = mongoose.model('Shippingmaster'),
  Categorymaster = mongoose.model('Categorymaster'),
  Shopmaster = mongoose.model('Shopmaster'),
  Productmaster = mongoose.model('Productmaster'),
  Address = mongoose.model('Address'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  address,
  shopmaster,
  shipping,
  category,
  productmaster;

/**
 * Shop routes tests
 */
describe('Shop CRUD tests', function () {

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

    address = new Address({
      firstname: user.firstName,
      lastname: user.lastName,
      tel: '0894447208',
      address: '55/7',
      subdistrict: 'บึงคำพร้อย',
      district: 'ลำลูกกา',
      province: 'ปทุมธานี',
      postcode: '12150'
    });

    shopmaster = new Shopmaster({
      name: 'Shop name',
      detail: 'detail',
      email: 'email@email.com',
      tel: '099999999',
      image: 'https://assets.wired.com/photos/w_1534/wp-content/uploads/2016/09/ff_nike-hyperadapt_angle_front.jpg',
      map: {
        lat: '1000',
        long: '1000'
      },
      rate: 4.5,
      review: [{
        rate: 4,
        comment: "ของดีสมราคา",
        user: user
      },
      {
        rate: 5,
        comment: "รองเท้าสวย ราคาไม่แพง",
        user: user
      }],
      historylog: [{
        customerid: user,
        historydate: "2017-08-10T06:25:00"
      },
      {
        customerid: user,
        historydate: "2017-08-05T14:05:59"
      }]
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

    productmaster = new Productmaster({
      name: 'Productmaster name2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shopmaster,
      shippings: [{
        shipping: shipping
      }],
      category: category,
      user: user
    });


    // Save a user to the test db and create new Shop
    user.save(function () {
      done();
    });
  });



  it('get shop by user', function (done) {
    // agent.post('/api/auth/signin')
    //   .send(credentials)
    //   .expect(200)
    //   .end(function (signinErr, signinRes) {
    //     // Handle signin error
    //     if (signinErr) {
    //       return done(signinErr);
    //     }

    //     // Get the userId
    //     var userId = user.id;

    // Save a new Shop
    // agent.post('/api/shops')
    //   .send(shopmaster)
    //   .expect(200)
    //   .end(function (shopSaveErr, shopSaveRes) {
    //     // Handle Shop save error
    //     if (shopSaveErr) {
    //       return done(shopSaveErr);
    //     }
    shopmaster.save(function (err, res) {
      shipping.save(function () {
        category.save(function () {
          productmaster.save(function () {

            agent.get('/api/shops/' + res._id)
              .end(function (shopgetErr, shopgetRes) {
                // Handle Shop save error
                if (shopgetErr) {
                  return done(shopgetErr);
                }

                // Set assertions
                var shop = shopgetRes.body;
                (shop.id).should.match(res.id);
                (shop.name).should.match(res.name);
                (shop.detail).should.match(res.detail);
                (shop.email).should.match(res.email);
                (shop.tel).should.match(res.tel);
                (shop.image).should.match(res.image);
                (shop.map.lat).should.match(res.map.lat);
                (shop.map.long).should.match(res.map.long);
                (shop.rate).should.match(res.rate);
                (shop.review[0].rate).should.match(res.review[0].rate);
                (shop.review[0].comment).should.match(res.review[0].comment);
                (shop.review[0].user).should.match(user.id);
                (shop.historylog[0].customerid).should.match(user.id);
                (shop.historylog[0].historydate).should.match('2017-08-10T06:25:00.000Z');
                (shop.products.length).should.match(1);
                // (shop.products[0].name).should.match(productmaster.name);
                // (shop.products[0].price).should.match(productmaster.price);
                // (shop.products[0].image).should.match(productmaster.image);

                // Call the assertion callback
                done();
              });
          });
        });
      });
    });

  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Shippingmaster.remove().exec(function () {
        Categorymaster.remove().exec(function () {
          Productmaster.remove().exec(function () {
            Shopmaster.remove().exec(done);
          });
        });
      });
    });
  });
});
