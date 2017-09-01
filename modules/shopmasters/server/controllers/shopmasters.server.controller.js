'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shopmaster = mongoose.model('Shopmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Shopmaster
 */
exports.create = function(req, res) {
  var shopmaster = new Shopmaster(req.body);
  shopmaster.user = req.user;

  shopmaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopmaster);
    }
  });
};

/**
 * Show the current Shopmaster
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var shopmaster = req.shopmaster ? req.shopmaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  shopmaster.isCurrentUserOwner = req.user && shopmaster.user && shopmaster.user._id.toString() === req.user._id.toString();

  res.jsonp(shopmaster);
};

/**
 * Update a Shopmaster
 */
exports.update = function(req, res) {
  var shopmaster = req.shopmaster;

  shopmaster = _.extend(shopmaster, req.body);

  shopmaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopmaster);
    }
  });
};

/**
 * Delete an Shopmaster
 */
exports.delete = function(req, res) {
  var shopmaster = req.shopmaster;

  shopmaster.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopmaster);
    }
  });
};

/**
 * List of Shopmasters
 */
exports.list = function(req, res) {
  Shopmaster.find().sort('-created').populate('user', 'displayName').exec(function(err, shopmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopmasters);
    }
  });
};

/**
 * Shopmaster middleware
 */
exports.shopmasterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shopmaster is invalid'
    });
  }

  Shopmaster.findById(id).populate('user', 'displayName').exec(function (err, shopmaster) {
    if (err) {
      return next(err);
    } else if (!shopmaster) {
      return res.status(404).send({
        message: 'No Shopmaster with that identifier has been found'
      });
    }
    req.shopmaster = shopmaster;
    next();
  });
};
