'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cart = mongoose.model('Cartmaster'),
  Shopmaster = mongoose.model('Shopmaster'),
  Shippingmaster = mongoose.model('Shippingmaster'),
  Categorymaster = mongoose.model('Categorymaster'),
  Address = mongoose.model('Address'),
  Product = mongoose.model('Productmaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  credentials2,
  user,
  user2,
  cart,
  cart2,
  product,
  product2,
  shop,
  shop2,
  shipping,
  category,
  category2,
  address;

/**
 * Cart routes tests
 */
describe('Cart CRUD tests', function () {

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

    credentials2 = {
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
      username: credentials2.username,
      password: credentials2.password,
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
      email: 'shop2@email.com',
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
      name: 'กีฬา',
      detail: 'sport'
    });

    product = new Product({
      name: 'Productmaster name',
      price: 100,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      issize: true,
      selectedsize: 'S',
      category: category,
      user: user
    });

    product2 = new Product({
      name: 'Productmaster name2',
      price: 50,
      image: [{
        url: 'http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg'
      }],
      shop: shop,
      shippings: [{
        shipping: shipping
      }],
      category: category,
      user: user,
      issize: false
    });

    cart2 = new Cart({
      products: [{
        product: product,
        itemamount: 100,
        qty: 1
      }],
      amount: 100,
      user: user2
    });

    // Save a user to the test db and create new Cart
    user.save(function () {
      user2.save(function () {
        address.save(function () {
          shop.save(function () {
            shipping.save(function () {
              category.save(function () {
                product.save(function () {
                  product2.save(function () {
                    cart2.save(function () {
                      cart = {
                        products: [{
                          product: product,
                          itemamount: 100,
                          qty: 1
                        }],
                        amount: 100,
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

  it('MDW : should be able add to cart (New no data)', function (done) {
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
        // Save a new Cart
        agent.post('/api/carts/add')
          .send(product)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle Cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }
            // Get Carts list
            var carts = cartSaveRes.body;
            // Set assertions
            (carts.user._id).should.equal(userId);
            (carts.products.length).should.match(1);
            // (carts.amount).should.match(100);
            // Call the assertion callback
            done();
          });
      });
  });

  it('MDW : should be able add to cart (Duplicate)', function (done) {
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
        // Save a new Cart
        agent.post('/api/carts/add')
          .send(product)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle Cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            agent.post('/api/carts/add')
              .send(product)
              .expect(200)
              .end(function (cartSaveErr, cartSaveRes) {
                // Handle Cart save error
                if (cartSaveErr) {
                  return done(cartSaveErr);
                }
                // Get Carts list
                var carts = cartSaveRes.body;
                // Set assertions
                (carts.user._id).should.equal(userId);
                (carts.products.length).should.match(1);
                (carts.amount).should.match(200);
                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('MDW : should be able add to cart (New have data)', function (done) {
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
        // Save a new Cart
        agent.post('/api/carts/add')
          .send(product)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle Cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            agent.post('/api/carts/add')
              .send(product)
              .expect(200)
              .end(function (cartSaveErr, cartSaveRes) {
                // Handle Cart save error
                if (cartSaveErr) {
                  return done(cartSaveErr);
                }

                agent.post('/api/carts/add')
                  .send(product2)
                  .expect(200)
                  .end(function (cartSaveErr, cartSaveRes) {
                    // Handle Cart save error
                    if (cartSaveErr) {
                      return done(cartSaveErr);
                    }
                    // Get Carts list
                    var carts = cartSaveRes.body;
                    // Set assertions
                    (carts.user._id).should.equal(userId);
                    (carts.products.length).should.match(2);
                    (carts.products[0].qty).should.match(2);
                    (carts.products[1].qty).should.match(1);
                    (carts.amount).should.match(250);
                    // Call the assertion callback
                    done();
                  });
              });
          });
      });
  });

  it('MDW : should be able remove to cart (Duplicate)', function (done) {
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
        // Save a new Cart
        agent.post('/api/carts/add')
          .send(product2)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle Cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            agent.post('/api/carts/add')
              .send(product2)
              .expect(200)
              .end(function (cartSaveErr, cartSaveRes) {
                // Handle Cart save error
                if (cartSaveErr) {
                  return done(cartSaveErr);
                }

                agent.post('/api/carts/add')
                  .send(product)
                  .expect(200)
                  .end(function (cartSaveErr, cartSaveRes) {
                    // Handle Cart save error
                    if (cartSaveErr) {
                      return done(cartSaveErr);
                    }

                    agent.post('/api/carts/add')
                      .send(product2)
                      .expect(200)
                      .end(function (cartSaveErr, cartSaveRes) {
                        // Handle Cart save error
                        if (cartSaveErr) {
                          return done(cartSaveErr);
                        }

                        agent.post('/api/carts/add')
                          .send(product)
                          .expect(200)
                          .end(function (cartSaveErr, cartSaveRes) {
                            // Handle Cart save error
                            if (cartSaveErr) {
                              return done(cartSaveErr);
                            }

                            agent.post('/api/carts/remove')
                              .send(product2)
                              .expect(200)
                              .end(function (cartSaveErr, cartSaveRes) {
                                // Handle Cart save error
                                if (cartSaveErr) {
                                  return done(cartSaveErr);
                                }
                                // Get Carts list
                                var carts = cartSaveRes.body;
                                // Set assertions
                                (carts.user._id).should.equal(userId);
                                (carts.products.length).should.match(2);
                                (carts.products[0].qty).should.match(2);
                                (carts.products[1].qty).should.match(2);
                                (carts.amount).should.match(300);
                                // Call the assertion callback
                                done();
                              });
                          });
                      });
                  });
              });
          });
      });
  });

  it('MDW : should be able delete item to cart', function (done) {
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
        // Save a new Cart
        agent.post('/api/carts/add')
          .send(product)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle Cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            agent.post('/api/carts/add')
              .send(product2)
              .expect(200)
              .end(function (cartSaveErr, cartSaveRes) {
                // Handle Cart save error
                if (cartSaveErr) {
                  return done(cartSaveErr);
                }

                agent.post('/api/carts/add')
                  .send(product)
                  .expect(200)
                  .end(function (cartSaveErr, cartSaveRes) {
                    // Handle Cart save error
                    if (cartSaveErr) {
                      return done(cartSaveErr);
                    }

                    agent.post('/api/carts/add')
                      .send(product2)
                      .expect(200)
                      .end(function (cartSaveErr, cartSaveRes) {
                        // Handle Cart save error
                        if (cartSaveErr) {
                          return done(cartSaveErr);
                        }

                        agent.post('/api/carts/delete')
                          .send(product2)
                          .expect(200)
                          .end(function (cartSaveErr, cartSaveRes) {
                            // Handle Cart save error
                            if (cartSaveErr) {
                              return done(cartSaveErr);
                            }
                            // Get Carts list
                            var carts = cartSaveRes.body;
                            // Set assertions
                            (carts.user._id).should.equal(userId);
                            (carts.products.length).should.match(1);
                            (carts.products[0].qty).should.match(2);
                            (carts.amount).should.match(200);
                            // Call the assertion callback
                            done();
                          });
                      });
                  });
              });
          });
      });
  });

  it('MDW : get cart by user login', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials2)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        // Get the userId
        var userId = user2.id;
        // Save a new Cart
        agent.post('/api/carts/add')
          .send(product)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle Cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            agent.get('/api/carts/get-by-user/' + userId)
              .end(function (cartSaveErr, cartSaveRes) {
                // Handle Cart save error
                if (cartSaveErr) {
                  return done(cartSaveErr);
                }
                // Get Carts list
                var carts = cartSaveRes.body;
                // Set assertions
                (carts.user._id).should.equal(userId);
                (carts.products.length).should.match(1);
                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Shopmaster.remove().exec(function () {
        Shippingmaster.remove().exec(function () {
          Categorymaster.remove().exec(function () {
            Product.remove().exec(function () {
              Cart.remove().exec(done);
            });
          });
        });
      });
    });
  });
});
