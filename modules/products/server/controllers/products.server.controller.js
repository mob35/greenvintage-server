'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Productmaster = mongoose.model('Productmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function (req, res) {
  var productmaster = new Productmaster(req.body);
  productmaster.user = req.user;

  productmaster.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(productmaster);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.productmaster ? req.productmaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Productmaster is invalid'
    });
  }

  Productmaster.findById(id).populate('user', 'displayName').exec(function (err, productmaster) {
    if (err) {
      return next(err);
    } else if (!productmaster) {
      return res.status(404).send({
        message: 'No Productmaster with that identifier has been found'
      });
    }
    req.productmaster = productmaster;
    next();
  });
};

exports.categoryByID = function (req, res, next, id) {
  req.categoryId = id;
  next();
};

exports.shopByID = function (req, res, next, id) {
  req.shopId = id;
  next();
};

exports.getByConditions = function (req, res, next) {
  var filter = {};
  if (req.categoryId !== 'all' && req.shopId === 'all') {
    filter = { category: req.categoryId };
  } else if (req.categoryId === 'all' && req.shopId !== 'all') {
    filter = { shop: req.shopId };
  } else if (req.categoryId !== 'all' && req.shopId !== 'all') {
    filter = { category: req.categoryId, shop: req.shopId };
  }
  Productmaster.find(filter).populate('user', 'displayName').exec(function (err, productmaster) {
    if (err) {
      return next(err);
    } else if (!productmaster) {
      return res.status(404).send({
        message: 'No Productmaster with that identifier has been found'
      });
    }
    req.productsByConditions = productmaster;
    next();
  });
};


exports.resultProducts = function (req, res) {
  res.jsonp(req.productsByConditions);
};