'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Home = mongoose.model('Home'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Home
 */
exports.create = function(req, res) {
  var home = new Home(req.body);
  home.user = req.user;

  home.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(home);
    }
  });
};

/**
 * Show the current Home
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var home = req.home ? req.home.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  home.isCurrentUserOwner = req.user && home.user && home.user._id.toString() === req.user._id.toString();

  res.jsonp(home);
};

/**
 * Update a Home
 */
exports.update = function(req, res) {
  var home = req.home;

  home = _.extend(home, req.body);

  home.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(home);
    }
  });
};

/**
 * Delete an Home
 */
exports.delete = function(req, res) {
  var home = req.home;

  home.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(home);
    }
  });
};

/**
 * List of Homes
 */
exports.list = function(req, res) {
  Home.find().sort('-created').populate('user', 'displayName').exec(function(err, homes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(homes);
    }
  });
};

/**
 * Home middleware
 */
exports.homeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Home is invalid'
    });
  }

  Home.findById(id).populate('user', 'displayName').exec(function (err, home) {
    if (err) {
      return next(err);
    } else if (!home) {
      return res.status(404).send({
        message: 'No Home with that identifier has been found'
      });
    }
    req.home = home;
    next();
  });
};
