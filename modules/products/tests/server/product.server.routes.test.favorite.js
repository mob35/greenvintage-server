'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Product = mongoose.model('Product'),
    Favorite = mongoose.model('Favorite'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    favorite,
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
                    var favorite = {
                        user: user,
                        created: new Date()
                    };
                    // Save a new Favorite Product
                    agent.post('/api/products/favorite/' + productObj.id)
                        .send(favorite)
                        .expect(200)
                        .end(function (productSaveErr, productSaveRes) {
                            // Handle Product save error
                            if (productSaveErr) {
                                return done(productSaveErr);
                            }
                            // Get Products list

                            agent.get('/api/products/' + productObj.id)
                                .end(function (productSaveErr, productSaveRes) {
                                    // Handle Product save error
                                    if (productSaveErr) {
                                        return done(productSaveErr);
                                    }
                                    var product = productSaveRes.body;

                                    // Set assertions
                                    product.favorites.should.be.instanceof(Array).and.have.lengthOf(1);
                                    (product.isfavorite).should.equal(true);

                                    // Call the assertion callback
                                    done();
                                });
                        });
                });
        });
    });

    it('should be able to save a Favorite Product if  not logged in', function (done) {
        var productObj = new Product(product);
        productObj.save(function () {


            // Get the userId
            var userId = user.id;
            var favorite = {
                user: user,
                created: new Date()
            };
            // Save a new Favorite Product
            agent.post('/api/products/favorite/' + productObj.id)
                .send(favorite)
                .expect(403)
                .end(function (productSaveErr, productSaveRes) {
                    // Handle Product save error
                    if (productSaveErr) {
                        return done(productSaveErr);
                    }
                    // Get Products list
                    done(productSaveErr);
                });
        });

    });

    it('should be able to save a Favorite Product and get List Favorite Product if logged in', function (done) {

        var productObj = new Product({
            name: 'Product Name',
            detail: 'Product Detail',
            price: 100,
            promotionprice: 80,
            percentofdiscount: 20,
            currency: '฿',
            user: user,
            images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982']
        });
        productObj.save(function () {
            agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) {
                        return done(signinErr);
                    }

                    var favorite = {
                        user: user,
                        created: new Date()
                    };
                    // Save a new Favorite Product
                    agent.post('/api/products/favorite/' + productObj.id)
                        .send(favorite)
                        .expect(200)
                        .end(function (productSaveErr, productSaveRes) {
                            // Handle Product save error
                            if (productSaveErr) {
                                return done(productSaveErr);
                            }

                            // Get the userId
                            var userId = user.id;
                            // Get a list of Products
                            agent.get('/api/favoriteproductlist')
                                .end(function (productsGetErr, productsGetRes) {
                                    // Handle Products save error
                                    if (productsGetErr) {
                                        return done(productsGetErr);
                                    }

                                    // Get Products list
                                    var products = productsGetRes.body;

                                    // Set assertions
                                    (products.title).should.equal('Favorite List');
                                    (products.items.length).should.match(1);

                                    // Call the assertion callback
                                    done();
                                });
                        });
                });
        });
    });

    it('should be able to unsave a Favorite Product if logged in', function (done) {
        var productObj = new Product({
            name: 'Product Name',
            detail: 'Product Detail',
            price: 100,
            promotionprice: 80,
            percentofdiscount: 20,
            currency: '฿',
            user: user,
            images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982']
        });
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
                    var favorite = {
                        user: user,
                        created: new Date()
                    };
                    // Save a new Favorite Product
                    agent.post('/api/products/favorite/' + productObj.id)
                        .send(favorite)
                        .expect(200)
                        .end(function (productSaveErr, productSaveRes) {
                            // Handle Product save error
                            if (productSaveErr) {
                                return done(productSaveErr);
                            }
                            agent.get('/api/products/unfavorite/' + productObj.id)
                                .end(function (favoriteGetErr, favoriteGetRes) {
                                    // Handle Products save error
                                    if (favoriteGetErr) {
                                        return done(favoriteGetErr);
                                    }
                                    // Get a list of Products
                                    agent.get('/api/products/' + productObj.id)
                                        .end(function (productsGetErr, productsGetRes) {
                                            // Handle Products save error
                                            if (productsGetErr) {
                                                return done(productsGetErr);
                                            }

                                            // Get Products list
                                            var product = productsGetRes.body;

                                            // Set assertions
                                            (product.isfavorite).should.equal(false);

                                            // Call the assertion callback
                                            done();
                                        });
                                });
                        });
                });
        });
    });

    it('should be able to update images', function (done) {
        var productObj = new Product({
            name: 'Product Name',
            detail: 'Product Detail',
            price: 100,
            promotionprice: 80,
            percentofdiscount: 20,
            currency: '฿',
            user: user,
            images: ['https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/black/iphone7-black-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430037379', 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=300&hei=300&fmt=png-alpha&qlt=95&.v=1472430205982']
        });
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
                    var images = ['test.jpg'];

                    // Save a new Favorite Product
                    agent.post('/api/products/updateimages/' + productObj.id)
                        .send(images)
                        .expect(200)
                        .end(function (productSaveErr, productSaveRes) {
                            // Handle Product save error
                            if (productSaveErr) {
                                return done(productSaveErr);
                            }
                            // Get a list of Products
                            agent.get('/api/products/' + productObj.id)
                                .end(function (productsGetErr, productsGetRes) {
                                    // Handle Products save error
                                    if (productsGetErr) {
                                        return done(productsGetErr);
                                    }

                                    // Get Products list
                                    var product = productsGetRes.body;

                                    // Set assertions
                                    (product.images.length).should.equal(3);

                                    // Call the assertion callback
                                    done();
                                });
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