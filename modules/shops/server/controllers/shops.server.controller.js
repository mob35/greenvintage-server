'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shopmaster = mongoose.model('Shopmaster'),
  Productmaster = mongoose.model('Productmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Shop
 */
exports.create = function (req, res) {
  var shop = new Shopmaster(req.body);

  shop.user = req.user;

  shop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shop);
    }
  });
};


exports.list = function (req, res) {
  // { created: { $gte: startdate, $lte: enddate } }
  // Shopmaster.find({ user: { _id: req.user._id } }).populate('user', 'displayName').exec(function (err, shop) {
  Shopmaster.find().populate('user', 'displayName').exec(function (err, shop) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(shop);
  });
};
/**
 * Show the current Shop
 */
exports.read = function (req, res, next) {
  // convert mongoose document to JSON
  var shop = req.shop ? req.shop.toJSON() : {};
  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  shop.isCurrentUserOwner = req.user && shop.user && shop.user._id.toString() === req.user._id.toString();

  // res.jsonp(shop);
  // req.shop = shop;
  // next();
  //req.shop.products = [];
  var _products = [];
  req.productbyshop.forEach(function (prod) {
    _products.push({
      id: prod._id,
      name: prod.name,
      image: prod.image[0].url,
      price: prod.price
    });

  });
  var _shop = {
    id: req.shop._id,
    name: req.shop.name,
    email: req.shop.email,
    tel: req.shop.tel,
    map: req.shop.map,
    image: req.shop.image,
    detail: req.shop.detail,
    review: req.shop.review,
    rate: req.shop.rate,
    historylog: req.shop.historylog,
    products: _products
  };
  res.jsonp(_shop);

};

/**
 * Shop middleware
 */
exports.shopByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shop is invalid'
    });
  }
  req.shopId = id;
  Shopmaster.findById(id).populate('user', 'displayName').exec(function (err, shop) {
    if (err) {
      return next(err);
    } else if (!shop) {
      return res.status(404).send({
        message: 'No Shop with that identifier has been found'
      });
    }
    req.shop = shop;
    next();

  });
};
exports.productByShop = function (req, res, next) {
  // { shop: { _id: req.shop._id } }
  Productmaster.find({ shop: { _id: req.shopId } }).sort('-created').exec(function (err, productmaster) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      req.productbyshop = productmaster;
      next();
    }
  });

};