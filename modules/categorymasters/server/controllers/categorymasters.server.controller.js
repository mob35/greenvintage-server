'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Categorymaster = mongoose.model('Categorymaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Categorymaster
 */
exports.create = function(req, res) {
  var categorymaster = new Categorymaster(req.body);
  categorymaster.user = req.user;

  categorymaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categorymaster);
    }
  });
};

/**
 * Show the current Categorymaster
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var categorymaster = req.categorymaster ? req.categorymaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  categorymaster.isCurrentUserOwner = req.user && categorymaster.user && categorymaster.user._id.toString() === req.user._id.toString();

  res.jsonp(categorymaster);
};

/**
 * Update a Categorymaster
 */
exports.update = function(req, res) {
  var categorymaster = req.categorymaster;

  categorymaster = _.extend(categorymaster, req.body);

  categorymaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categorymaster);
    }
  });
};

/**
 * Delete an Categorymaster
 */
exports.delete = function(req, res) {
  var categorymaster = req.categorymaster;

  categorymaster.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categorymaster);
    }
  });
};

/**
 * List of Categorymasters
 */
exports.list = function(req, res) {
  Categorymaster.find().sort('-created').populate('user', 'displayName').exec(function(err, categorymasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categorymasters);
    }
  });
};

/**
 * Categorymaster middleware
 */
exports.categorymasterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Categorymaster is invalid'
    });
  }

  Categorymaster.findById(id).populate('user', 'displayName').exec(function (err, categorymaster) {
    if (err) {
      return next(err);
    } else if (!categorymaster) {
      return res.status(404).send({
        message: 'No Categorymaster with that identifier has been found'
      });
    }
    req.categorymaster = categorymaster;
    next();
  });
};
