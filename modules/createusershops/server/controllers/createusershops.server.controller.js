'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shop = mongoose.model('Shopmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.createUser = function (req, res, next) {
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('save user success');
      req.createuser = user;
      next();
    }
  });
};

exports.createShop = function (req, res, next) {
  var shop = new Shop(req.body.shop);
  shop.user = req.createuser;
  shop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('save shop success');      
      req.createshop = shop;
      next();
    }
  });
};

exports.updateUserShopCreate = function (req, res) {
  var user = req.createuser;
  console.log(user);
  User.findById(user._id, function (err, user) {
    user.shop = req.createshop;
    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(user);
      }
    });
  });
};
