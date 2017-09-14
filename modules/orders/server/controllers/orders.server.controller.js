'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  Cart = mongoose.model('Cart'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Order
 */
exports.create = function (req, res, next) {
  var order = new Order(req.body);
  if (req.user && req.user !== undefined) {
    order.user = req.user;
  }
  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.order = order;
      next();
    }
  });
};

exports.findCart = function (req, res, next) {
  var filter = {};
  if (req.user && req.user !== undefined) {
    filter = { user: { _id: req.user._id } };
  } else {
    filter = { user: { _id: req.order.user } };
  }
  Cart.find(filter).sort('-created').populate('user', 'displayName').exec(function (err, carts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (carts && carts.length > 0) {
        req.cartId = carts[0]._id;
        next();
      } else {
        next();
      }
    }
  });
};

exports.clearCart = function (req, res) {
  if (req.cartId && req.cartId !== undefined) {
    Cart.findById(req.cartId).populate('user', 'displayName').exec(function (err, cart) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        cart.remove(function (err2) {
          if (err2) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err2)
            });
          } else {
            res.jsonp(req.order);
          }
        });
      }
    });
  } else {
    res.jsonp(req.order);
  }

};

/**
 * Show the current Order
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var order = req.order ? req.order.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  order.isCurrentUserOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString();

  res.jsonp(order);
};

/**
 * Update a Order
 */
exports.update = function (req, res) {
  var order = req.order;

  order = _.extend(order, req.body);

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Delete an Order
 */
exports.delete = function (req, res) {
  var order = req.order;

  order.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function (req, res) {
  Order.find().sort('-created').populate('user', 'displayName').populate('shipping').populate('payment').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

/**
 * List of Orders Shop
 */
exports.listordershop = function (req, res) {
  // { items: { product: { shop: _id } } }
  Order.find({ },"items.product").sort('-created').populate('user', 'displayName').populate('shipping').populate('payment').populate('items.product').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Order.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No Order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};
