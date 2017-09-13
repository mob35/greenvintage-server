'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Category = mongoose.model('Category'),
  Product = mongoose.model('Product'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  category,
  product;

/**
 * Category routes tests
 */
describe('Category Of Home tests', function () {

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

    category = new Category({
      name: 'Category name'
    });

    product = new Product({
      name: 'Product Name',
      detail: 'Product Detail',
      price: 100,
      promotionprice: 80,
      percentofdiscount: 20,
      currency: '฿',
      categories: [category],
      cod: true,
      images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982']
    });

    // Save a user to the test db and create new Category
    user.save(function () {
      category.user=user;
      category.save(function(){
        product.save(function(){
          done();
        });
      });
    });
  });

  it('should be able to get home data of categories', function (done) {
    // Get a list of Categories
    agent.get('/api/dataofcategories')
    .end(function (categoriesGetErr, categoriesGetRes) {
      // Handle Categories save error
      if (categoriesGetErr) {
        return done(categoriesGetErr);
      }

      // Get Categories list
      var categories = categoriesGetRes.body;

      // Set assertions
      (categories.length).should.equal(1);
      (categories[0].name).should.equal(category.name);
      (categories[0].popularproducts.length).should.equal(1);
      (categories[0].bestseller.length).should.equal(1);
      (categories[0].lastvisit.length).should.equal(1);
      (categories[0].popularshops.length).should.equal(0);
      
      // Call the assertion callback
      done();
    });
  });


  afterEach(function (done) {
    User.remove().exec(function () {
      Category.remove().exec(function(){
        Product.remove().exec(done);
      });
    });
  });
});
