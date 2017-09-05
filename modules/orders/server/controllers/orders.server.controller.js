'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ordermaster = mongoose.model('Ordermaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.getOrderByshop = function (req, res, next) {
  var shop = req.user.shop ? req.user.shop : '';
  Ordermaster.find().sort('-created').populate('user', 'displayName').populate('shipping').populate({
    path: 'items',
    populate: [{
      path: 'product',
      model: 'Productmaster'
    },
    {
      path: 'delivery',
      model: 'Shippingmaster'
    }]
  }).exec(function (err, ordermasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var orders = ordermasters.filter(function (obj) {
        var orderShop = obj.items.filter(function (obj2) { return obj2.product.shop.toString() === shop.toString(); });
        return orderShop.length > 0 === true;
      });
      req.orders = orders;
      next();
    }
  });
};

exports.filterStatus = function (req, res, next) {
  var orders = req.orders.filter(function (obj) {
    var orderStatus = obj.items.filter(function (obj2) { return obj2.status.toString() === 'waiting'; });
    return orderStatus.length > 0 === true;
  });
  req.orders = orders;
  next();
};

exports.filterStatusPaid = function (req, res, next) {
  var orders = req.orders.filter(function (obj) {
    return obj.status.toString() === 'paid';
  });
  req.orders = orders;
  next();
};

exports.resultOrders = function (req, res) {
  res.jsonp(req.orders);
};
