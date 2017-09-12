'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Favorite = mongoose.model('Favorite'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function (req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.getProductList = function (req, res, next) {
  Product.find({}, '_id name images price promotionprice percentofdiscount currency').sort('-created').populate('user', 'displayName').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.products = products;
      next();
    }
  });
};

exports.cookingProductList = function (req, res, next) {
  var products = [];
  req.products.forEach(function (element) {
    products.push({
      _id: element._id,
      name: element.name,
      image: element.images[0],
      price: element.price,
      promotionprice: element.promotionprice,
      percentofdiscount: element.percentofdiscount,
      currency: element.currency,
      rate: 5
    });
  });
  req.productsCookingList = products;
  next();
};

exports.list = function (req, res) {
  res.jsonp({
    title: 'Product List',
    items: req.productsCookingList
  });
};
/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};

exports.createFavorite = function (req, res, next) {
  var favorite = new Favorite(req.body);
  favorite.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.favorite = favorite;
      next();
    }
  });
};
exports.updateFavoriteProduct = function (req, res, next) {
  req.product.favorites.push(req.favorite);
  req.product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      next();
    }
  });
};
exports.getFavoriteList = function (req, res, next) {
  Product.find({}, '_id name images price promotionprice percentofdiscount currency favorites').sort('-created').populate('user', 'displayName').populate('favorites').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var productlist = products.filter(function (obj) {
        var favorite = obj.favorites.filter(function (obj2) { 
          return obj2.user.toString() === req.user._id.toString(); 
        });
        return favorite.length > 0 === true;
      });
      req.productsfavorite = productlist;
      next();
    }
  });
  // var data = {
  //   title: "Favorite List",
  //   items:[]
  // };
  // res.jsonp(data);
};

exports.cookingFavorite = function (req, res, next) {
  var favorites = [];
  req.productsfavorite.forEach(function (prod) {
    favorites.push({
      _id: prod._id,
      name: prod.name,
      image: prod.images[0],
      price: prod.price,
      promotionprice: prod.promotionprice,
      percentofdiscount: prod.percentofdiscount,
      currency: prod.currency,
      rate: 5
    });
  });
  req.favoritelist = favorites;
  next();
};

exports.favorites = function (req, res) {
  res.jsonp({
    title: 'Favorite List',
    items: req.favoritelist
  });
};

