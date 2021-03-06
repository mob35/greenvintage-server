'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order'),
  Address = mongoose.model('Address'),
  Product = mongoose.model('Product'),
  Shipping = mongoose.model('Shipping'),
  Category = mongoose.model('Category'),
  Shop = mongoose.model('Shop'),
  Cart = mongoose.model('Cart'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  order,
  address,
  product,
  shipping,
  cart,
  category,
  shop;

/**
 * Order routes tests
 */
describe('Get Order Shop CRUD tests', function () {

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
    category = new Category({
      name: 'แฟชั่น'
    });
    shop = new Shop({
      name: 'Shop name',
      user: user
    });
    product = new Product({
      name: 'Product Name',
      detail: 'Product Detail',
      price: 100,
      promotionprice: 80,
      percentofdiscount: 20,
      currency: '฿',
      shippings: [shipping],
      categories: [category],
      cod: true,
      shop: shop,
      images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982']
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

    cart = new Cart({
      items: {
        product: product[0],
        qty: 1,
        amount: 100,
        discount: 20,
        totalamount: 80
      },
      amount: 100,
      discount: 20,
      totalamount: 80,
      user: user
    });

    // Save a user to the test db and create new Order
    user.save(function () {
      address.save(function () {
        shipping.save(function () {
          shop.save(function () {
            category.save(function () {
              product.save(function () {
                order = {
                  shipping: address,
                  items: [
                    {
                      product: product,
                      qty: 1,
                      delivery: {
                        detail: "วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี",
                        name: "ส่งแบบส่งด่วน",
                        price: 0
                      },
                      amount: 20000,
                      discount: 2000,
                      deliveryprice: 0,
                      totalamount: 18000,
                    }
                  ],
                  amount: 30000,
                  discount: 2000,
                  totalamount: 28000,
                  deliveryprice: 0

                };
                done();
              });
            });

          });
        });
      });
    });
  });

  it('get order shop', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        var userId = user.id;

        agent.post('/api/orders')
          .send(order)
          .expect(200)
          .end(function (orderSaveErr, orderSaveRes) {
            // Handle Order save error
            if (orderSaveErr) {
              return done(orderSaveErr);
            }
            agent.get('/api/getordersbyshop')
              .end(function (ordersGetErr, ordersGetRes) {
                // Handle Orders save error
                if (ordersGetErr) {
                  return done(ordersGetErr);
                }

                // Get Orders list
                var orders = ordersGetRes.body;
                orders.waiting.should.be.instanceof(Array).and.have.lengthOf(1);
                orders.accept.should.be.instanceof(Array).and.have.lengthOf(0);
                orders.sent.should.be.instanceof(Array).and.have.lengthOf(0);
                orders.return.should.be.instanceof(Array).and.have.lengthOf(0);

                (orders.waiting[0].name).should.match('Product Name');
                (orders.waiting[0].price).should.match(20000);
                (orders.waiting[0].qty).should.match(1);
                (orders.waiting[0].rate).should.match(5);
                (orders.waiting[0].status).should.match('waiting');
                (orders.waiting[0].shipping.address).should.match(address.address);
                (orders.waiting[0].delivery).should.match({
                  detail: "วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี",
                  name: "ส่งแบบส่งด่วน",
                  price: 0
                });

                done();
              });
          });
      });
  });

  it('get order shop & Update status Accept', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        var userId = user.id;

        agent.post('/api/orders')
          .send(order)
          .expect(200)
          .end(function (orderSaveErr, orderSaveRes) {
            // Handle Order save error
            if (orderSaveErr) {
              return done(orderSaveErr);
            }
            agent.get('/api/getordersbyshop')
              .end(function (ordersGetErr, ordersGetRes) {
                // Handle Orders save error
                if (ordersGetErr) {
                  return done(ordersGetErr);
                }
                // Get Orders list
                var orders = ordersGetRes.body;
                orders.waiting.should.be.instanceof(Array).and.have.lengthOf(1);
                orders.accept.should.be.instanceof(Array).and.have.lengthOf(0);
                orders.sent.should.be.instanceof(Array).and.have.lengthOf(0);
                orders.return.should.be.instanceof(Array).and.have.lengthOf(0);
                (orders.waiting[0].name).should.match('Product Name');
                (orders.waiting[0].price).should.match(20000);
                (orders.waiting[0].qty).should.match(1);
                (orders.waiting[0].rate).should.match(5);
                (orders.waiting[0].status).should.match('waiting');

                agent.put('/api/updateorderaccept/' + orders.waiting[0].order_id)
                  .send(orders.waiting[0])
                  .expect(200)
                  .end(function (orderUpdateErr, orderUpdateRes) {
                    // Handle Order update error
                    if (orderUpdateErr) {
                      return done(orderUpdateErr);
                    }

                    var orderUpdate = orderUpdateRes.body;
                    (orderUpdate.status).should.match('accept');


                    orders.waiting[0] = orderUpdate;
                    agent.put('/api/updateordersent/' + orders.waiting[0].order_id)
                      .send(orders.waiting[0])
                      .expect(200)
                      .end(function (orderUpdateErr, orderUpdateRes) {
                        // Handle Order update error
                        if (orderUpdateErr) {
                          return done(orderUpdateErr);
                        }

                        var orderUpdate = orderUpdateRes.body;
                        (orderUpdate.status).should.match('sent');


                        orders.waiting[0] = orderUpdate;
                        agent.put('/api/updateordercomplete/' + orders.waiting[0].order_id)
                          .send(orders.waiting[0])
                          .expect(200)
                          .end(function (orderUpdateErr, orderUpdateRes) {
                            // Handle Order update error
                            if (orderUpdateErr) {
                              return done(orderUpdateErr);
                            }

                            var orderUpdate = orderUpdateRes.body;
                            (orderUpdate.status).should.match('complete');


                            orders.waiting[0] = orderUpdate;
                            agent.put('/api/updateorderreject/' + orders.waiting[0].order_id)
                              .send(orders.waiting[0])
                              .expect(200)
                              .end(function (orderUpdateErr, orderUpdateRes) {
                                // Handle Order update error
                                if (orderUpdateErr) {
                                  return done(orderUpdateErr);
                                }

                                var orderUpdate = orderUpdateRes.body;
                                (orderUpdate.status).should.match('reject');

                                orders.waiting[0] = orderUpdate;
                                agent.put('/api/updateorderreturn/' + orders.waiting[0].order_id)
                                  .send(orders.waiting[0])
                                  .expect(200)
                                  .end(function (orderUpdateErr, orderUpdateRes) {
                                    // Handle Order update error
                                    if (orderUpdateErr) {
                                      return done(orderUpdateErr);
                                    }

                                    var orderUpdate = orderUpdateRes.body;
                                    (orderUpdate.status).should.match('return');
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


  afterEach(function (done) {
    User.remove().exec(function () {
      Shipping.remove().exec(function () {
        Address.remove().exec(function () {
          Shop.remove().exec(function () {
            Cart.remove().exec(function () {
              Order.remove().exec(done);
            });
          });
        });
      });
    });
  });
});
