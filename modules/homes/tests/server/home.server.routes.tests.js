'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shopmaster = mongoose.model('Shopmaster'),
  Shippingmaster = mongoose.model('Shippingmaster'),
  Categorymaster = mongoose.model('Categorymaster'),
  Address = mongoose.model('Address'),
  Productmaster = mongoose.model('Productmaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  credential2,
  user,
  user2,
  product,
  shop,
  shop2,
  shipping,
  category,
  category2,
  category3,
  address;

/**
 * Home routes tests
 */
describe('Home CRUD tests', function () {

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

    credential2 = {
      username: 'username2',
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

    user2 = new User({
      firstName: 'Full2',
      lastName: 'Name2',
      displayName: 'Full2 Name2',
      email: 'test2@test.com',
      username: credential2.username,
      password: credential2.password,
      provider: 'local'
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

    shop2 = new Shopmaster({
      name: 'Shopmaster Name2',
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

    category2 = new Categorymaster({
      name: 'cate2',
      detail: 'cate2'
    });

    category3 = new Categorymaster({
      name: 'cate3',
      detail: 'cate3'
    });

    // Save a user to the test db and create new Home
    user.save(function () {
      user2.save(function () {
        address.save(function () {
          shop.save(function () {
            shop2.save(function () {
              shipping.save(function () {
                category.save(function () {
                  category2.save(function () {
                    category3.save(function () {
                      product = {
                        name: 'Productmaster name',
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
                      };

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
  });

  // it('should be able to save a Home if logged in', function (done) {
  //   var productObj = new Productmaster({
  //     name: 'Productmaster productObj user 2 view',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date('2017', '09', '1'),
  //       qty: 1
  //     }],
  //     historylog: [{
  //       user: user2,
  //       date: new Date()
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj2 = new Productmaster({
  //     name: 'Productmaster productObj2',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user,
  //       date: new Date('2017', '09', '1')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 2
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj3 = new Productmaster({
  //     name: 'Productmaster productObj3',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user,
  //       date: new Date('2017', '09', '1')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '2')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '2')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 3
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj4 = new Productmaster({
  //     name: 'Productmaster productObj4',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user,
  //       date: new Date('2017', '09', '1')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '2')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '2')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 4
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj5 = new Productmaster({
  //     name: 'Productmaster productObj5',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user,
  //       date: new Date('2017', '09', '5')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '4')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 5
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj6 = new Productmaster({
  //     name: 'Productmaster productObj6',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '2')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '2')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '1')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 6
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj7 = new Productmaster({
  //     name: 'Productmaster productObj7',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop2,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user,
  //       date: new Date('2017', '09', '5')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '5')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '4')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 7
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj8 = new Productmaster({
  //     name: 'Productmaster productObj8',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user,
  //       date: new Date('2017', '09', '4')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 8
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj9 = new Productmaster({
  //     name: 'Productmaster productObj9',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user,
  //       date: new Date('2017', '11', '5')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '5')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '4')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '3')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 9
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   var productObj10 = new Productmaster({
  //     name: 'Productmaster productObj10',
  //     price: 1234,
  //     image: [{
  //       url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
  //     }],
  //     shop: shop,
  //     shippings: [{
  //       shipping: shipping
  //     }],
  //     historylog: [{
  //       user: user2,
  //       date: new Date('2017', '11', '12')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '4')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '5')
  //     }, {
  //       user: user,
  //       date: new Date('2017', '09', '2')
  //     }],
  //     sellerlog: [{
  //       user: user,
  //       date: new Date(),
  //       qty: 10
  //     }, {
  //       user: user,
  //       date: new Date(),
  //       qty: 5
  //     }],
  //     category: category,
  //     user: user
  //   });
  //   productObj2.save();
  //   productObj3.save();
  //   productObj4.save();
  //   productObj5.save();
  //   productObj6.save();
  //   productObj7.save();
  //   productObj8.save();
  //   productObj9.save();
  //   productObj10.save();
  //   productObj.save(function () {
  //     agent.post('/api/auth/signin')
  //       .send(credentials)
  //       .expect(200)
  //       .end(function (signinErr, signinRes) {
  //         // Handle signin error
  //         if (signinErr) {
  //           return done(signinErr);
  //         }

  //         // Get the userId
  //         var userId = user.id;

  //         // Get a list of Homes
  //         agent.get('/api/homes')
  //           .end(function (homesGetErr, homesGetRes) {
  //             // Handle Homes save error
  //             if (homesGetErr) {
  //               return done(homesGetErr);
  //             }

  //             // Get Homes list
  //             var homes = homesGetRes.body;

  //             // Set assertions
  //             (homes.categories[0].popularproducts.length).should.equal(6);
  //             (homes.categories[0].bestseller.length).should.equal(6);
  //             (homes.categories[0].bestseller[0].name).should.equal('Productmaster productObj10');
  //             (homes.categories[0].popularshops.length).should.equal(2);
  //             (homes.categories[0].popularshops[0].name).should.equal('Shopmaster Name');
  //             (homes.categories[0].popularshops[1].name).should.equal('Shopmaster Name2');
  //             (homes.categories[0].lastvisit.length).should.equal(6);


  //             // Call the assertion callback
  //             done();
  //           });
  //       });
  //   });
  // });


  it('should be able to get a Home if logged in', function (done) {
    var productObj = new Productmaster({
      name: 'Productmaster productObj user 2 view',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      sellerlog: [{
        user: user,
        date: new Date('2017', '08', '1'),
        qty: 1
      }],
      historylog: [{
        user: user2,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj2 = new Productmaster({
      name: 'Productmaster productObj2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '08', '1')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 2
      }],
      category: category,
      user: user
    });
    var productObj3 = new Productmaster({
      name: 'Productmaster productObj3',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '08', '1')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 3
      }],
      category: category,
      user: user
    });
    var productObj4 = new Productmaster({
      name: 'Productmaster productObj4',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '08', '1')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 4
      }],
      category: category,
      user: user
    });
    var productObj5 = new Productmaster({
      name: 'Productmaster productObj5',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '08', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 5
      }],
      category: category,
      user: user
    });
    var productObj6 = new Productmaster({
      name: 'Productmaster productObj6',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '08', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '1')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 6
      }],
      category: category,
      user: user
    });
    var productObj7 = new Productmaster({
      name: 'Productmaster productObj7',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '08', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 7
      }],
      category: category,
      user: user
    });
    var productObj8 = new Productmaster({
      name: 'Productmaster productObj8',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '08', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 8
      }],
      category: category,
      user: user
    });
    var productObj9 = new Productmaster({
      name: 'Productmaster productObj9',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '11', '5')
      }, {
        user: user,
        date: new Date('2017', '08', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 9
      }],
      category: category,
      user: user
    });
    var productObj10 = new Productmaster({
      name: 'Productmaster productObj10',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '08', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date('2017', '11', '12'),
        qty: 10
      }, {
        user: user,
        date: new Date('2017', '11', '12'),
        qty: 5
      }],
      category: category,
      user: user
    });
    productObj2.save();
    productObj3.save();
    productObj4.save();
    productObj5.save();
    productObj6.save();
    productObj7.save();
    productObj8.save();
    productObj9.save();
    // productObj10.save();
    productObj10.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Get a list of Homes
          agent.get('/api/homes')
            .end(function (homesGetErr, homesGetRes) {
              // Handle Homes save error
              if (homesGetErr) {
                return done(homesGetErr);
              }

              // Get Homes list
              var homes = homesGetRes.body;

              // Set assertions
              (homes.categories.length).should.equal(3);
              // (homes.categories).should.equal('');
              (homes.categories[0].name).should.equal(category.name);
              (homes.categories[0].detail).should.equal(category.detail);
              (homes.categories[0].popularproducts.length).should.equal(6);
              (homes.categories[0].popularproducts[0].name).should.equal(productObj10.name);
              (homes.categories[0].popularproducts[0].image).should.equal(productObj10.image[0].url);
              (homes.categories[0].popularproducts[0].price).should.equal(productObj10.price);
              (homes.categories[0].bestseller.length).should.equal(8);
              (homes.categories[0].bestseller[0].name).should.equal(productObj9.name);
              (homes.categories[0].bestseller[0].image).should.equal(productObj9.image[0].url);
              (homes.categories[0].bestseller[0].price).should.equal(productObj9.price);
              (homes.categories[0].lastvisit.length).should.equal(6);
              (homes.categories[0].lastvisit[0].name).should.equal(productObj10.name);
              (homes.categories[0].lastvisit[0].image).should.equal(productObj10.image[0].url);
              (homes.categories[0].lastvisit[0].price).should.equal(productObj10.price);
              (homes.categories[0].productvoucher.length).should.equal(3);
              (homes.categories[0].shopvoucher.length).should.equal(3);
              (homes.categories[0].popularshops.length).should.equal(2);
              (homes.categories[0].popularshops[0].name).should.equal(shop.name);
              (homes.categories[0].popularshops[0].image).should.equal(shop.image);

              (homes.categories[1].name).should.equal(category2.name);
              (homes.categories[1].popularproducts.length).should.equal(0);
              (homes.categories[1].bestseller.length).should.equal(0);
              (homes.categories[1].popularshops.length).should.equal(0);
              (homes.categories[1].lastvisit.length).should.equal(0);


              (homes.categories[2].name).should.equal(category3.name);
              (homes.categories[2].popularproducts.length).should.equal(0);
              (homes.categories[2].bestseller.length).should.equal(0);
              (homes.categories[2].popularshops.length).should.equal(0);
              (homes.categories[2].lastvisit.length).should.equal(0);
              // (homes.categories[0].popularproducts.length).should.equal(6);
              // (homes.categories[0].bestseller.length).should.equal(6);
              // (homes.categories[0].bestseller[0].name).should.equal('Productmaster productObj10');
              // (homes.categories[0].popularshops.length).should.equal(2);
              // (homes.categories[0].popularshops[0].name).should.equal('Shopmaster Name');
              // (homes.categories[0].popularshops[1].name).should.equal('Shopmaster Name2');
              // (homes.categories[0].lastvisit.length).should.equal(6);


              // Call the assertion callback
              done();
            });
        });
    });
  });



  it('get top 20 bestseller if logged in', function (done) {
    var productObj = new Productmaster({
      name: 'Productmaster productObj user 2 view',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      sellerlog: [{
        user: user,
        date: new Date('2017', '09', '1'),
        qty: 1
      }],
      historylog: [{
        user: user2,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj2 = new Productmaster({
      name: 'Productmaster productObj2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 2
      }],
      category: category,
      user: user
    });
    var productObj3 = new Productmaster({
      name: 'Productmaster productObj3',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 3
      }],
      category: category,
      user: user
    });
    var productObj4 = new Productmaster({
      name: 'Productmaster productObj4',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 4
      }],
      category: category,
      user: user
    });
    var productObj5 = new Productmaster({
      name: 'Productmaster productObj5',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 5
      }],
      category: category,
      user: user
    });
    var productObj6 = new Productmaster({
      name: 'Productmaster productObj6',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '1')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 6
      }],
      category: category,
      user: user
    });
    var productObj7 = new Productmaster({
      name: 'Productmaster productObj7',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 7
      }],
      category: category,
      user: user
    });
    var productObj8 = new Productmaster({
      name: 'Productmaster productObj8',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 8
      }],
      category: category,
      user: user
    });
    var productObj9 = new Productmaster({
      name: 'Productmaster productObj9',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '11', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 9
      }],
      category: category,
      user: user
    });
    var productObj10 = new Productmaster({
      name: 'Productmaster productObj10',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 10
      }],
      category: category,
      user: user
    });
    var productObj11 = new Productmaster({
      name: 'Productmaster productObj11',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 11
      }],
      category: category,
      user: user
    });
    var productObj12 = new Productmaster({
      name: 'Productmaster productObj12',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 12
      }],
      category: category,
      user: user
    });
    var productObj13 = new Productmaster({
      name: 'Productmaster productObj13',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 13
      }],
      category: category,
      user: user
    });
    var productObj14 = new Productmaster({
      name: 'Productmaster productObj14',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 14
      }],
      category: category,
      user: user
    });
    var productObj15 = new Productmaster({
      name: 'Productmaster productObj15',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 15
      }],
      category: category,
      user: user
    });
    var productObj16 = new Productmaster({
      name: 'Productmaster productObj16',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 16
      }],
      category: category,
      user: user
    });
    var productObj17 = new Productmaster({
      name: 'Productmaster productObj17',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 17
      }],
      category: category,
      user: user
    });
    var productObj18 = new Productmaster({
      name: 'Productmaster productObj18',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 18
      }],
      category: category,
      user: user
    });
    var productObj19 = new Productmaster({
      name: 'Productmaster productObj19',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 19
      }],
      category: category,
      user: user
    });
    var productObj20 = new Productmaster({
      name: 'Productmaster productObj20',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 20
      }],
      category: category,
      user: user
    });
    var productObj21 = new Productmaster({
      name: 'Productmaster productObj21',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 21
      }],
      category: category,
      user: user
    });
    var productObj22 = new Productmaster({
      name: 'Productmaster productObj22',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 22
      }],
      category: category,
      user: user
    });
    productObj2.save();
    productObj3.save();
    productObj4.save();
    productObj5.save();
    productObj6.save();
    productObj7.save();
    productObj8.save();
    productObj9.save();
    productObj10.save();
    productObj11.save();
    productObj12.save();
    productObj13.save();
    productObj14.save();
    productObj15.save();
    productObj16.save();
    productObj17.save();
    productObj18.save();
    productObj19.save();
    productObj20.save();
    productObj21.save();
    productObj22.save();
    productObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Get a list of Homes
          agent.get('/api/getproducttop/bestseller')
            .end(function (homesGetErr, homesGetRes) {
              // Handle Homes save error
              if (homesGetErr) {
                return done(homesGetErr);
              }

              // Get Homes list
              var products = homesGetRes.body;

              // Set assertions
              (products.length).should.equal(20);
              (products[0].name).should.equal('Productmaster productObj22');


              // Call the assertion callback
              done();
            });
        });
    });
  });

  it('get top 20 popular if logged in', function (done) {
    var productObj = new Productmaster({
      name: 'Productmaster productObj user 2 view',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      sellerlog: [{
        user: user,
        date: new Date('2017', '09', '1'),
        qty: 1
      }],
      historylog: [{
        user: user2,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj2 = new Productmaster({
      name: 'Productmaster productObj2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 2
      }],
      category: category,
      user: user
    });
    var productObj3 = new Productmaster({
      name: 'Productmaster productObj3',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 3
      }],
      category: category,
      user: user
    });
    var productObj4 = new Productmaster({
      name: 'Productmaster productObj4',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 4
      }],
      category: category,
      user: user
    });
    var productObj5 = new Productmaster({
      name: 'Productmaster productObj5',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 5
      }],
      category: category,
      user: user
    });
    var productObj6 = new Productmaster({
      name: 'Productmaster productObj6',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '1')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 6
      }],
      category: category,
      user: user
    });
    var productObj7 = new Productmaster({
      name: 'Productmaster productObj7',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 7
      }],
      category: category,
      user: user
    });
    var productObj8 = new Productmaster({
      name: 'Productmaster productObj8',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 8
      }],
      category: category,
      user: user
    });
    var productObj9 = new Productmaster({
      name: 'Productmaster productObj9',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '11', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 9
      }],
      category: category,
      user: user
    });
    var productObj10 = new Productmaster({
      name: 'Productmaster productObj10',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 10
      }],
      category: category,
      user: user
    });
    var productObj11 = new Productmaster({
      name: 'Productmaster productObj11',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 11
      }],
      category: category,
      user: user
    });
    var productObj12 = new Productmaster({
      name: 'Productmaster productObj12',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 12
      }],
      category: category,
      user: user
    });
    var productObj13 = new Productmaster({
      name: 'Productmaster productObj13',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 13
      }],
      category: category,
      user: user
    });
    var productObj14 = new Productmaster({
      name: 'Productmaster productObj14',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 14
      }],
      category: category,
      user: user
    });
    var productObj15 = new Productmaster({
      name: 'Productmaster productObj15',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 15
      }],
      category: category,
      user: user
    });
    var productObj16 = new Productmaster({
      name: 'Productmaster productObj16',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 16
      }],
      category: category,
      user: user
    });
    var productObj17 = new Productmaster({
      name: 'Productmaster productObj17',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 17
      }],
      category: category,
      user: user
    });
    var productObj18 = new Productmaster({
      name: 'Productmaster productObj18',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 18
      }],
      category: category,
      user: user
    });
    var productObj19 = new Productmaster({
      name: 'Productmaster productObj19',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 19
      }],
      category: category,
      user: user
    });
    var productObj20 = new Productmaster({
      name: 'Productmaster productObj20',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 20
      }],
      category: category,
      user: user
    });
    var productObj21 = new Productmaster({
      name: 'Productmaster productObj21',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 21
      }],
      category: category,
      user: user
    });
    var productObj22 = new Productmaster({
      name: 'Productmaster productObj22',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 22
      }],
      category: category,
      user: user
    });
    productObj2.save();
    productObj3.save();
    productObj4.save();
    productObj5.save();
    productObj6.save();
    productObj7.save();
    productObj8.save();
    productObj9.save();
    productObj10.save();
    productObj11.save();
    productObj12.save();
    productObj13.save();
    productObj14.save();
    productObj15.save();
    productObj16.save();
    productObj17.save();
    productObj18.save();
    productObj19.save();
    productObj20.save();
    productObj21.save();
    productObj22.save();
    productObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Get a list of Homes
          agent.get('/api/getproducttop/popular')
            .end(function (homesGetErr, homesGetRes) {
              // Handle Homes save error
              if (homesGetErr) {
                return done(homesGetErr);
              }

              // Get Homes list
              var products = homesGetRes.body;

              // Set assertions
              (products.length).should.equal(20);
              (products[0].name).should.equal('Productmaster productObj22');


              // Call the assertion callback
              done();
            });
        });
    });
  });

  it('get top 20 keyword not found', function (done) {
    var productObj = new Productmaster({
      name: 'Productmaster productObj user 2 view',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      sellerlog: [{
        user: user,
        date: new Date('2017', '09', '1'),
        qty: 1
      }],
      historylog: [{
        user: user2,
        date: new Date()
      }],
      category: category,
      user: user
    });
    var productObj2 = new Productmaster({
      name: 'Productmaster productObj2',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 2
      }],
      category: category,
      user: user
    });
    var productObj3 = new Productmaster({
      name: 'Productmaster productObj3',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 3
      }],
      category: category,
      user: user
    });
    var productObj4 = new Productmaster({
      name: 'Productmaster productObj4',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '1')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 4
      }],
      category: category,
      user: user
    });
    var productObj5 = new Productmaster({
      name: 'Productmaster productObj5',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 5
      }],
      category: category,
      user: user
    });
    var productObj6 = new Productmaster({
      name: 'Productmaster productObj6',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user,
        date: new Date('2017', '09', '1')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 6
      }],
      category: category,
      user: user
    });
    var productObj7 = new Productmaster({
      name: 'Productmaster productObj7',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop2,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 7
      }],
      category: category,
      user: user
    });
    var productObj8 = new Productmaster({
      name: 'Productmaster productObj8',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 8
      }],
      category: category,
      user: user
    });
    var productObj9 = new Productmaster({
      name: 'Productmaster productObj9',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user,
        date: new Date('2017', '11', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '3')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 9
      }],
      category: category,
      user: user
    });
    var productObj10 = new Productmaster({
      name: 'Productmaster productObj10',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 10
      }],
      category: category,
      user: user
    });
    var productObj11 = new Productmaster({
      name: 'Productmaster productObj11',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 11
      }],
      category: category,
      user: user
    });
    var productObj12 = new Productmaster({
      name: 'Productmaster productObj12',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 12
      }],
      category: category,
      user: user
    });
    var productObj13 = new Productmaster({
      name: 'Productmaster productObj13',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 13
      }],
      category: category,
      user: user
    });
    var productObj14 = new Productmaster({
      name: 'Productmaster productObj14',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 14
      }],
      category: category,
      user: user
    });
    var productObj15 = new Productmaster({
      name: 'Productmaster productObj15',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 15
      }],
      category: category,
      user: user
    });
    var productObj16 = new Productmaster({
      name: 'Productmaster productObj16',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 16
      }],
      category: category,
      user: user
    });
    var productObj17 = new Productmaster({
      name: 'Productmaster productObj17',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 17
      }],
      category: category,
      user: user
    });
    var productObj18 = new Productmaster({
      name: 'Productmaster productObj18',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 18
      }],
      category: category,
      user: user
    });
    var productObj19 = new Productmaster({
      name: 'Productmaster productObj19',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 19
      }],
      category: category,
      user: user
    });
    var productObj20 = new Productmaster({
      name: 'Productmaster productObj20',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 20
      }],
      category: category,
      user: user
    });
    var productObj21 = new Productmaster({
      name: 'Productmaster productObj21',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 21
      }],
      category: category,
      user: user
    });
    var productObj22 = new Productmaster({
      name: 'Productmaster productObj22',
      price: 1234,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      historylog: [{
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }, {
        user: user2,
        date: new Date('2017', '11', '12')
      }, {
        user: user,
        date: new Date('2017', '09', '4')
      }, {
        user: user,
        date: new Date('2017', '09', '5')
      }, {
        user: user,
        date: new Date('2017', '09', '2')
      }],
      sellerlog: [{
        user: user,
        date: new Date(),
        qty: 22
      }],
      category: category,
      user: user
    });
    productObj2.save();
    productObj3.save();
    productObj4.save();
    productObj5.save();
    productObj6.save();
    productObj7.save();
    productObj8.save();
    productObj9.save();
    productObj10.save();
    productObj11.save();
    productObj12.save();
    productObj13.save();
    productObj14.save();
    productObj15.save();
    productObj16.save();
    productObj17.save();
    productObj18.save();
    productObj19.save();
    productObj20.save();
    productObj21.save();
    productObj22.save();
    productObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Get a list of Homes
          agent.get('/api/getproducttop/asdf')
            .end(function (homesGetErr, homesGetRes) {
              // Handle Homes save error
              if (homesGetErr) {
                return done(homesGetErr);
              }

              // Get Homes list
              var products = homesGetRes.body;

              // Set assertions
              (products.length).should.equal(0);


              // Call the assertion callback
              done();
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Address.remove().exec(function () {
        Shopmaster.remove().exec(function () {
          Shippingmaster.remove().exec(function () {
            Categorymaster.remove().exec(function () {
              Productmaster.remove().exec(done);
            });
          });
        });
      });
    });
  });
});
