'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Product = mongoose.model('Product'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    product;

/**
* Product routes tests
*/

describe('Favorite Product Get list tests ', function () {
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
        // Save a user to the test db and create new Product
        user.save(function () {
            product = {
                name: 'Product Name',
                detail: 'Product Detail',
                price: 100,
                promotionprice: 80,
                percentofdiscount: 20,
                currency: '฿',
                images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982']
            };

            done();
        });

    });

    // it('favorite test', function (done) {
    //     // 1.ทำsignin
    //     // 2.save favorite
    //     done();
    // });

    it('should be able to save a Favorite Product if logged in', function (done) {
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
    
            // Save a new Favorite Product
            agent.post('/api/products/favorite')
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
    
                // Call the assertion callback
                done();
              });
          });
      });
    
    
      it('should be able to save a Favorite Product and get List Favorite Product if logged in', function (done) {
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
    afterEach(function (done) {
        User.remove().exec(function () {
            Product.remove().exec(done);
        });
    });
});