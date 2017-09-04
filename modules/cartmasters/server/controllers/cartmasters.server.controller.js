'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cartmaster = mongoose.model('Cartmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cartmaster
 */
exports.create = function(req, res) {
  var cartmaster = new Cartmaster(req.body);
  cartmaster.user = req.user;

  cartmaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cartmaster);
    }
  });
};

/**
 * Show the current Cartmaster
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var cartmaster = req.cartmaster ? req.cartmaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cartmaster.isCurrentUserOwner = req.user && cartmaster.user && cartmaster.user._id.toString() === req.user._id.toString();

  res.jsonp(cartmaster);
};

/**
 * Update a Cartmaster
 */
exports.update = function(req, res) {
  var cartmaster = req.cartmaster;

  cartmaster = _.extend(cartmaster, req.body);

  cartmaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cartmaster);
    }
  });
};

/**
 * Delete an Cartmaster
 */
exports.delete = function(req, res) {
  var cartmaster = req.cartmaster;

  cartmaster.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cartmaster);
    }
  });
};

/**
 * List of Cartmasters
 */
exports.list = function(req, res) {
  Cartmaster.find().sort('-created').populate('user', 'displayName').exec(function(err, cartmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cartmasters);
    }
  });
};

/**
 * Cartmaster middleware
 */
exports.cartmasterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cartmaster is invalid'
    });
  }

  Cartmaster.findById(id).populate('user', 'displayName').exec(function (err, cartmaster) {
    if (err) {
      return next(err);
    } else if (!cartmaster) {
      return res.status(404).send({
        message: 'No Cartmaster with that identifier has been found'
      });
    }
    req.cartmaster = cartmaster;
    next();
  });
};
