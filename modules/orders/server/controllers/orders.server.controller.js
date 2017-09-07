'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ordermaster = mongoose.model('Ordermaster'),
  Cartmaster = mongoose.model('Cartmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.getOrderByshop = function (req, res, next) {
  console.log(req.user);
  var shop = req.user ? req.user.shop : '';
  Ordermaster.find().sort('-created').populate('user', 'displayName').populate('shipping').populate({
    path: 'items',
    populate: [{
      path: 'product',
      model: 'Productmaster',
      populate: [{
        path: 'category',
        model: 'Categorymaster'
      }, {
        path: 'shop',
        model: 'Shopmaster'
      }, {
        path: 'shippings.shipping',
        model: 'Shippingmaster'
      }]
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
        var orderShop = obj.items.filter(function (obj2) { return obj2.product.shop._id.toString() === shop.toString(); });
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

exports.filterStatusNotCancelAndConfirm = function (req, res, next) {
  var orders = req.orders.filter(function (obj) {
    return obj.status.toString() !== 'cancel';
  });

  var orders2 = orders.filter(function (obj) {
    return obj.status.toString() !== 'confirm';
  });
  req.orders = orders2;
  next();
};

exports.resultOrders = function (req, res) {
  res.jsonp(req.orders);
};

exports.createOrder = function (req, res, next) {
  var order = new Ordermaster(req.body);
  order.user = req.user;
  console.log(order);
  order.save(function (err) {
    if (err) {
      console.log('save order : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.orderCreate = order;
      next();
    }
  });
};

exports.removeCart = function (req, res) {
  Cartmaster.findById(req.orderCreate.cart).populate('user', 'displayName').exec(function (err, cart) {
    if (err) {
      console.log('find cart err : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    cart.remove(function (err) {
      if (err) {
        console.log('remove cart err : ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(req.orderCreate);
      }
    });
  });
};