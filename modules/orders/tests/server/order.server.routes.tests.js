'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  Ordermaster = mongoose.model('Ordermaster'),
  Productmaster = mongoose.model('Productmaster'),
  Categorymaster = mongoose.model('Categorymaster'),
  Shopmaster = mongoose.model('Shopmaster'),
  Address = mongoose.model('Address'),
  Shippingmaster = mongoose.model('Shippingmaster'),
  User = mongoose.model('User'),
  Cartmaster = mongoose.model('Cartmaster'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  product,
  address,
  shipping,
  shop,
  cart,
  category,
  order;

/**
 * Order routes tests
 */
describe('Order CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'getorder',
      password: 'P@ssw0rd1234'
    };

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

    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local',
      shop: shop
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

    product = new Productmaster({
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
    });

    cart = new Cartmaster({
      products: [{
        product: product,
        itemamount: 1234,
        qty: 1
      }],
      amount: 1234,
      user: user
    });

    // Save a user to the test db and create new Order
    user.save(function () {
      address.save(function () {
        shop.save(function () {
          shipping.save(function () {
            category.save(function () {
              product.save(function () {
                cart.save(function () {
                  order = {
                    shipping: address,
                    items: [{
                      product: product,
                      qty: 1,
                      amount: 1234,
                      size: 'S',
                      delivery: shipping
                    }],
                    payment: {
                      paymenttype: 'Counterservice',
                      counterservice: '7-11'
                    },
                    amount: 1234,
                    discount: 234,
                    totalamount: 1000,
                    cart: cart.id
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

  it('get order by shop and status waiting', function (done) {
    var orderObj1 = new Ordermaster({
      shipping: address,
      items: [{
        product: product,
        qty: 1,
        amount: 1234,
        size: 'S',
        delivery: shipping
      }, {
        product: product,
        qty: 1,
        amount: 1234,
        size: 'M',
        delivery: shipping,
        status: 'accept'
      }],
      payment: {
        paymenttype: 'Counterservice',
        counterservice: '7-11'
      },
      amount: 1234,
      discount: 234,
      totalamount: 1000,
      cart: cart.id,
      user: user
    });
    orderObj1.save();
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

        // Get a list of Orders
        agent.get('/api/ordersbyshop')
          .end(function (ordersGetErr, ordersGetRes) {
            // Handle Orders save error
            if (ordersGetErr) {
              return done(ordersGetErr);
            }

            // Get Orders list
            var orders = ordersGetRes.body;

            // Set assertions
            (orders[0].user._id).should.equal(userId);
            (orders[0].totalamount).should.match(1000);


            // Call the assertion callback
            done();
          });
      });
  });

  it('get order by shop and status not waiting', function (done) {
    var orderObj1 = new Ordermaster({
      shipping: address,
      items: [{
        product: product,
        qty: 1,
        amount: 1234,
        size: 'S',
        delivery: shipping,
        status: 'accept'
      }],
      payment: {
        paymenttype: 'Counterservice',
        counterservice: '7-11'
      },
      amount: 1234,
      discount: 234,
      totalamount: 1000,
      cart: cart.id,
      user: user
    });
    orderObj1.save();
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

        // Get a list of Orders
        agent.get('/api/ordersbyshop')
          .end(function (ordersGetErr, ordersGetRes) {
            // Handle Orders save error
            if (ordersGetErr) {
              return done(ordersGetErr);
            }

            // Get Orders list
            var orders = ordersGetRes.body;

            // Set assertions
            (orders.length).should.equal(0);

            // Call the assertion callback
            done();
          });
      });
  });

  it('get order by shop and status order paid', function (done) {
    var orderObj1 = new Ordermaster({
      shipping: address,
      items: [{
        product: product,
        qty: 1,
        amount: 1234,
        size: 'S',
        delivery: shipping,
        status: 'waiting'
      }],
      payment: {
        paymenttype: 'Counterservice',
        counterservice: '7-11'
      },
      status: 'paid',
      amount: 1234,
      discount: 234,
      totalamount: 1000,
      cart: cart.id,
      user: user
    });
    var orderObj2 = new Ordermaster({
      shipping: address,
      items: [{
        product: product,
        qty: 1,
        amount: 1234,
        size: 'S',
        delivery: shipping,
        status: 'accept'
      }],
      payment: {
        paymenttype: 'Counterservice',
        counterservice: '7-11'
      },
      amount: 1234,
      discount: 234,
      status: 'confirm',
      totalamount: 1000,
      cart: cart.id,
      user: user
    });
    var orderObj3 = new Ordermaster({
      shipping: address,
      items: [{
        product: product,
        qty: 1,
        amount: 1234,
        size: 'S',
        delivery: shipping,
        status: 'accept'
      }],
      payment: {
        paymenttype: 'Counterservice',
        counterservice: '7-11'
      },
      amount: 1234,
      discount: 234,
      status: 'cancel',
      totalamount: 1000,
      cart: cart.id,
      user: user
    });
    orderObj2.save();
    orderObj1.save();
    orderObj3.save();
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

        // Get a list of Orders
        agent.get('/api/orderlistbyshops')
          .end(function (ordersGetErr, ordersGetRes) {
            // Handle Orders save error
            if (ordersGetErr) {
              return done(ordersGetErr);
            }

            // Get Orders list
            var orders = ordersGetRes.body;

            // Set assertions
            (orders.waiting.length).should.equal(1);
            (orders.waiting[0].order_id).should.equal(orderObj1.id);
            (orders.waiting[0].item_id).should.equal(orderObj1.items[0].id);
            (orders.waiting[0].name).should.equal(product.name);
            (orders.waiting[0].price).should.equal(product.price);
            (orders.waiting[0].qty).should.equal(orderObj1.items[0].qty);
            (orders.waiting[0].image).should.equal(product.image[0].url);
            (orders.waiting[0].status).should.equal(orderObj1.items[0].status);
            (orders.accept.length).should.equal(2);
            (orders.sent.length).should.equal(0);
            (orders.return.length).should.equal(0);

            // Call the assertion callback
            done();
          });
      });
  });

  it('create order', function (done) {
    var orderObj1 = {
      shipping: address,
      items: [{
        product: product,
        qty: 1,
        amount: 1234,
        size: 'S',
        delivery: shipping,
        status: 'accept'
      }],
      payment: {
        paymenttype: 'Counterservice',
        counterservice: '7-11'
      },
      amount: 1234,
      discount: 234,
      totalamount: 1000,
      cart: cart.id,
      user: user
    };
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

        // Get a list of Orders
        agent.post('/api/order')
          .send(orderObj1)
          .expect(200)
          .end(function (ordersErr, ordersRes) {
            // Handle Orders save error
            if (ordersErr) {
              return done(ordersErr);
            }

            // Get Orders list
            var orders = ordersRes.body;

            // Set assertions
            (orders.user._id).should.equal(userId);
            (orders.totalamount).should.match(1000);

            // Call the assertion callback
            agent.get('/api/cartmasters')
              .end(function (ordersGetErr, ordersGetRes) {
                // Handle Orders save error
                if (ordersGetErr) {
                  return done(ordersGetErr);
                }

                // Get Orders list
                var orders = ordersGetRes.body;

                // Set assertions
                (orders.length).should.equal(0);

                // Call the assertion callback
                done();
              });
          });
      });
  });


  // it('get order by id by itemid', function (done) {
  //   var orderObj1 = {
  //     shipping: address,
  //     items: [{
  //       product: product,
  //       qty: 1,
  //       amount: 1234,
  //       size: 'S',
  //       delivery: shipping,
  //       status: 'accept'
  //     }],
  //     payment: {
  //       paymenttype: 'Counterservice',
  //       counterservice: '7-11'
  //     },
  //     amount: 1234,
  //     discount: 234,
  //     totalamount: 1000,
  //     cart: cart.id,
  //     user: user
  //   };
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Get a list of Orders
  //       agent.post('/api/order')
  //         .send(orderObj1)
  //         .expect(200)
  //         .end(function (ordersErr, ordersRes) {
  //           // Handle Orders save error
  //           if (ordersErr) {
  //             return done(ordersErr);
  //           }

  //           // Get Orders list
  //           var orders = ordersRes.body;

  //           // Set assertions
  //           (orders.user._id).should.equal(userId);
  //           (orders.totalamount).should.match(1000);

  //           // Call the assertion callback
  //           agent.get('/api/orders/' + orders._id + '/' + orders.items[0]._id)
  //             .end(function (ordersGetErr, ordersGetRes) {
  //               // Handle Orders save error
  //               if (ordersGetErr) {
  //                 return done(ordersGetErr);
  //               }

  //               // Get Orders list
  //               var orders2 = ordersGetRes.body;

  //               // Set assertions
  //               (orders2.order_id).should.equal(orders._id);
  //               (orders2.item_id).should.equal(orders.items[0]._id);
  //               (orders2.name).should.equal(product.name);
  //               (orders2.price).should.equal(product.price);
  //               (orders2.qty).should.equal(orders.items[0].qty);
  //               (orders2.image).should.equal(product.image);
  //               (orders2.status).should.equal(orders.items[0].status);
  //               (orders2.delivery).should.equal(shipping);
  //               (orders2.shipping).should.equal(address);

  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });



  afterEach(function (done) {
    User.remove().exec(function () {
      Address.remove().exec(function () {
        Shopmaster.remove().exec(function () {
          Shippingmaster.remove().exec(function () {
            Categorymaster.remove().exec(function () {
              Productmaster.remove().exec(function () {
                Cartmaster.remove().exec(function () {
                  Ordermaster.remove().exec(done);
                });
              });
            });
          });
        });
      });
    });
  });
});
