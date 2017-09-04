'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sizemaster = mongoose.model('Sizemaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sizemaster
 */
exports.create = function(req, res) {
  var sizemaster = new Sizemaster(req.body);
  sizemaster.user = req.user;

  sizemaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sizemaster);
    }
  });
};

/**
 * Show the current Sizemaster
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sizemaster = req.sizemaster ? req.sizemaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sizemaster.isCurrentUserOwner = req.user && sizemaster.user && sizemaster.user._id.toString() === req.user._id.toString();

  res.jsonp(sizemaster);
};

/**
 * Update a Sizemaster
 */
exports.update = function(req, res) {
  var sizemaster = req.sizemaster;

  sizemaster = _.extend(sizemaster, req.body);

  sizemaster.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sizemaster);
    }
  });
};

/**
 * Delete an Sizemaster
 */
exports.delete = function(req, res) {
  var sizemaster = req.sizemaster;

  sizemaster.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sizemaster);
    }
  });
};

/**
 * List of Sizemasters
 */
exports.list = function(req, res) {
  Sizemaster.find().sort('-created').populate('user', 'displayName').exec(function(err, sizemasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sizemasters);
    }
  });
};

/**
 * Sizemaster middleware
 */
exports.sizemasterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sizemaster is invalid'
    });
  }

  Sizemaster.findById(id).populate('user', 'displayName').exec(function (err, sizemaster) {
    if (err) {
      return next(err);
    } else if (!sizemaster) {
      return res.status(404).send({
        message: 'No Sizemaster with that identifier has been found'
      });
    }
    req.sizemaster = sizemaster;
    next();
  });
};
