'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cart = mongoose.model('Cart'),
  Product = mongoose.model('Product'),
  Shop = mongoose.model('Shop'),
  Shipping = mongoose.model('Shipping'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

//********** Create Cart **********
exports.cartID = function (req, res, next) {
  var cart = req.body;

  if (cart._id) {
    if (!mongoose.Types.ObjectId.isValid(cart._id)) {
      return res.status(400).send({
        message: 'Cart is invalid'
      });
    }

    Cart.findById(cart._id).populate('user', 'displayName').exec(function (err, cart) {
      if (err) {
        return next(err);
      } else if (!cart) {
        return res.status(404).send({
          message: 'No Cart with that identifier has been found'
        });
      }
      req.cart = cart;
      next();
    });
  } else {
    req.cart = cart;
    next();
  }
};

/**
 * Create a Cart
 */
exports.create = function (req, res, next) {
  if (req.cart._id) {
    next();
  } else {
    var cartCreate = new Cart(req.cart);
    cartCreate.user = req.user ? req.user : cartCreate.user;
    cartCreate.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Product.populate(cartCreate, {
          path: 'items.product'
        }, function (err, cart) {
          Shop.populate(cart, { path: 'items.product.shop' }, function (err, cartpopshop) {
            Shipping.populate(cartpopshop, { path: 'items.product.shippings' }, function (err, cartpopshipping) {
              req.cart = cartpopshipping;
              next();
            });
          });
        });
      }
    });
  }
};

/**
 * Update a Cart
 */
exports.update = function (req, res, next) {

  if (req.cart._id) {
    var cartUpdate = req.cart;
    cartUpdate = _.extend(cartUpdate, req.body);

    cartUpdate.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Product.populate(cartUpdate, {
          path: 'items.product'
        }, function (err, cart) {
          Shop.populate(cart, { path: 'items.product.shop' }, function (err, cartpopshop) {
            Shipping.populate(cartpopshop, { path: 'items.product.shippings' }, function (err, cartpopshipping) {
              req.cart = cartpopshipping;
              next();
            });
          });
        });
      }
    });
  } else {
    next();
  }
};

//********** Create Cart **********

//********** Read By User ID //**********

exports.cartByUserID = function (req, res, next, userId) {
  Cart.find({
    user: userId
  }).sort('-created').populate({
    path: 'items',
    populate: {
      path: 'product',
      model: 'Product',
      populate: [{
        path: 'shop',
        model: 'Shop'
      }, {
        path: 'shippings',
        model: 'Shipping'
      }]
    }
  }).populate('user', 'displayName').exec(function (err, carts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.cart = carts[0];
      next();
    }
  });
};

//********** Read By User ID //**********

exports.readCart = function (req, res) {
  res.jsonp({
    title: 'CART',
    cart: req.cart
  });
};

/**
 * Show the current Cart
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cart = req.cart ? req.cart.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cart.isCurrentUserOwner = req.user && cart.user && cart.user._id.toString() === req.user._id.toString();

  res.jsonp(cart);
};


/**
 * Delete an Cart
 */
exports.delete = function (req, res) {
  var cart = req.cart;

  cart.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cart);
    }
  });
};

/**
 * List of Carts
 */
exports.list = function (req, res) {
  Cart.find().sort('-created').populate('user', 'displayName').exec(function (err, carts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carts);
    }
  });
};

/**
 * Cart middleware
 */
exports.cartByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cart is invalid'
    });
  }

  Cart.findById(id).populate('user', 'displayName').exec(function (err, cart) {
    if (err) {
      return next(err);
    } else if (!cart) {
      return res.status(404).send({
        message: 'No Cart with that identifier has been found'
      });
    }
    req.cart = cart;
    next();
  });
};
