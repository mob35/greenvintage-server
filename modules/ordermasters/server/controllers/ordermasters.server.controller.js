'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ordermaster = mongoose.model('Ordermaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Ordermaster
 */
exports.create = function(req, res) {
  var ordermaster = new Ordermaster(req.body);
  ordermaster.user = req.user;

  ordermaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ordermaster);
    }
  });
};

/**
 * Show the current Ordermaster
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ordermaster = req.ordermaster ? req.ordermaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ordermaster.isCurrentUserOwner = req.user && ordermaster.user && ordermaster.user._id.toString() === req.user._id.toString();

  res.jsonp(ordermaster);
};

/**
 * Update a Ordermaster
 */
exports.update = function(req, res) {
  // req.body;
  var ordermaster = req.ordermaster;

  ordermaster = _.extend(ordermaster.items, req.body);

  ordermaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ordermaster);
    }
  });
};

/**
 * Delete an Ordermaster
 */
exports.delete = function(req, res) {
  var ordermaster = req.ordermaster;

  ordermaster.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ordermaster);
    }
  });
};

/**
 * List of Ordermasters
 */
exports.list = function(req, res) {
  Ordermaster.find().sort('-created').populate('user', 'displayName').exec(function(err, ordermasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ordermasters);
    }
  });
};

/**
 * Ordermaster middleware
 */
exports.ordermasterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ordermaster is invalid'
    });
  }

  Ordermaster.findById(id).populate('user', 'displayName').exec(function (err, ordermaster) {
    if (err) {
      return next(err);
    } else if (!ordermaster) {
      return res.status(404).send({
        message: 'No Ordermaster with that identifier has been found'
      });
    }
    req.ordermaster = ordermaster;
    next();
  });
};
