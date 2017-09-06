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
 * Create a Productmaster
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
 * Show the current Productmaster
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var productmaster = req.productmaster ? req.productmaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  productmaster.isCurrentUserOwner = req.user && productmaster.user && productmaster.user._id.toString() === req.user._id.toString();

  res.jsonp(productmaster);
};

/**
 * Update a Productmaster
 */
exports.update = function (req, res) {
  var productmaster = req.productmaster;

  productmaster = _.extend(productmaster, req.body);

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
 * Delete an Productmaster
 */
exports.delete = function (req, res) {
  var productmaster = req.productmaster;

  productmaster.remove(function (err) {
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
 * List of Productmasters
 */
exports.list = function (req, res) {
  Productmaster.find().sort('-created').populate('user', 'displayName').populate('shop').populate('category').populate('size').populate('shippings.shipping').exec(function (err, productmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(productmasters);
    }
  });
};

/**
 * Productmaster middleware
 */
exports.productmasterByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Productmaster is invalid'
    });
  }

  Productmaster.findById(id).populate('user', 'displayName').populate('shop').populate('category').populate('size').populate('shippings.shipping').exec(function (err, productmaster) {
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
