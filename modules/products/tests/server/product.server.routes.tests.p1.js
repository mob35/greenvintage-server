'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  Shipping = mongoose.model('Shipping'),
  Category = mongoose.model('Category'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  shipping,
  category,
  product;

/**
 * Product routes tests
 */
describe('Product CRUD tests P1', function () {

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

    shipping = new Shipping({
      name: 'EMS',
      detail: 'EMS 7 Days',
      price: 0
    });

    category = new Category({
      name: 'แฟชั่น'
    });

    // Save a user to the test db and create new Product
    user.save(function () {
      shipping.save(function () {
        category.save(function () {
          product = {
            name: 'Product Name',
            detail: 'Product Detail',
            price: 100,
            promotionprice: 80,
            percentofdiscount: 20,
            currency: '฿',
            shippings: [shipping],
            categories: [category],
            cod: true,
            images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982']
          };

          done();
        });
      });

    });
  });

  it('should be able to save a Product if logged in', function (done) {
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

        // Save a new Product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function (productSaveErr, productSaveRes) {
            // Handle Product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }
            // Get Products list
            var product = productSaveRes.body;

            // Set assertions
            (product.user._id).should.equal(userId);
            (product.name).should.match(product.name);
            (product.detail).should.match(product.detail);
            (product.price).should.match(product.price);
            (product.promotionprice).should.match(product.promotionprice);
            (product.percentofdiscount).should.match(product.percentofdiscount);
            (product.currency).should.match(product.currency);
            (product.images.length).should.match(product.images.length);
            (product.images[0]).should.match(product.images[0]);
            (product.images[1]).should.match(product.images[1]);
            (product.categories).should.be.instanceof(Array).and.have.lengthOf(1);
            (product.cod).should.match(product.cod);
            // Call the assertion callback
            done();
          });
      });
  });


  it('should be able to save a Product and get List Product if logged in', function (done) {
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

        // Save a new Product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function (productSaveErr, productSaveRes) {
            // Handle Product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }

            // Get a list of Products
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle Products save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get Products list
                var products = productsGetRes.body;

                // Set assertions
                (products.title).should.equal('Product List');
                (products.items[0].name).should.match(product.name);
                (products.items[0].image).should.match(product.images[0]);
                (products.items[0].price).should.match(product.price);
                (products.items[0].promotionprice).should.match(product.promotionprice);
                (products.items[0].percentofdiscount).should.match(product.percentofdiscount);
                (products.items[0].currency).should.match(product.currency);
                (products.items[0].rate).should.match(5);

                // Call the assertion callback
                done();
              });
          });
      });
  });


  it('should be able to save a Review Product if logged in', function (done) {
    var productObj = new Product(product);
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

          var review = {
            topic: 'Topic',
            comment: 'Comment',
            rate: 5
          };

          agent.post('/api/products/review/' + productObj.id)
            .send(review)
            .expect(200)
            .end(function (reviewErr, reviewRes) {
              // Handle signin error
              if (reviewErr) {
                return done(reviewErr);
              }
              agent.get('/api/products/' + productObj.id)
                .send(review)
                .expect(200)
                .end(function (productErr, productRes) {
                  // Handle signin error
                  if (productErr) {
                    return done(productErr);
                  }
                  var product = productRes.body;

                  (product.reviews.length).should.match(1);
                  (product.name).should.match(productObj.name);
                  (product.price).should.match(productObj.price);
                  (product.promotionprice).should.match(productObj.promotionprice);
                  (product.percentofdiscount).should.match(productObj.percentofdiscount);
                  (product.currency).should.match(productObj.currency);
                  (product.rate).should.match(5);

                  done();

                });
            });


        });
    });

  });

  it('should be able to get Product Detail if logged in', function (done) {
    // var shippingObj = new Shipping({
    //   name: 'EMS',
    //   detail: 'EMS 7 Days',
    //   price: 0
    // });
    // shippingObj.save(function () {

    var productObj = new Product({
      name: 'Product Name',
      detail: 'Product Detail',
      price: 100,
      promotionprice: 80,
      percentofdiscount: 20,
      currency: '฿',
      shippings: [shipping],
      images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982']
    });
    // productObj.shippings.push(shippingObj);
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


          agent.get('/api/products/' + productObj.id)
            .end(function (productErr, productRes) {
              // Handle signin error
              if (productErr) {
                return done(productErr);
              }
              var product = productRes.body;

              (product.name).should.match(productObj.name);
              (product.price).should.match(productObj.price);
              (product.promotionprice).should.match(productObj.promotionprice);
              (product.percentofdiscount).should.match(productObj.percentofdiscount);
              (product.currency).should.match(productObj.currency);
              (product.rate).should.match(5);
              (product.shippings.length).should.match(1);
              (product.shippings[0]._id).should.match(shipping.id);
              (product.shippings[0].name).should.match(shipping.name);

              done();

            });


        });
    });
    // });


  });



  afterEach(function (done) {
    User.remove().exec(function () {
      Shipping.remove().exec(function () {
        Category.remove().exec(function(){
          Product.remove().exec(done);
        });
      });
    });
  });
});
