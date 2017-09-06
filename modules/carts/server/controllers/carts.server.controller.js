'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cart = mongoose.model('Cartmaster'),
  Productmaster = mongoose.model('Productmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.manageCartByID = function (req, res, next, id) {
  req.id = id;
  next();
};

exports.findUserCart = function (req, res, next) {
  // req.user._id 
  var user_id;
  if (req.id) {
    user_id = req.id;
  } else {
    // console.log(req.body);
    user_id = req.user ? req.user._id : req.body.selecteduser._id;
    req.user = req.user ? req.user : req.body.selecteduser;
  }
  Cart.find({
    user: user_id
  })
    .populate('user', 'displayName')
    .populate({
      path: 'products',
      populate: {
        path: 'product',
        model: 'Productmaster',
        populate: [{
          path: 'shop',
          model: 'Shopmaster'
        },
        {
          path: 'shippings',
          populate: {
            path: 'shipping',
            model: 'Shippingmaster'
          }
        }
        ]
      }
    }).exec(function (err, cart) {
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

exports.processingAddUserCart = function (req, res, next) {

  var product = req.body;
  if (req.cart.length > 0) {
    var item = req.cart[0];
    var data = item.products.filter(function (obj) {
      if (product.issize && product.selectedsize) {
        if (obj.product._id.toString() === product._id.toString()) {
          if (obj.selectedsize === product.selectedsize) {
            return true;
          }
        }
      } else {
        if (obj.product._id.toString() === product._id.toString()) {
          return true;
        }
      }
      return false;
    });
    if (data.length > 0) {
      data[0].qty++;
      data[0].itemamount = data[0].product.price * data[0].qty;
    } else {
      item.products.push({
        product: product,
        qty: 1,
        selectedsize: product.selectedsize ? product.selectedsize : null,
        itemamount: product.price
      });
    }

    item.amount = 0;
    if (item.products && item.products.length > 0) {
      item.products.forEach(function (element) {
        item.amount += element.itemamount;
      });
    }
    req.userCart = item;
    next();

  } else {
    var products = [{
      product: product,
      qty: 1,
      itemamount: product.price,
      selectedsize: product.selectedsize ? product.selectedsize : null,
    }];
    var userCart = {
      products: products,
      amount: product.price
    };
    req.userCart = userCart;
    next();

  }
};

exports.processingRemoveUserCart = function (req, res, next) {

  var product = req.body;
  var item = req.cart[0];
  var data = item.products.filter(function (obj) {
    return obj.product._id.toString() === product._id.toString();
  });
  data[0].qty--;
  data[0].itemamount = data[0].product.price * data[0].qty;
  item.amount = 0;
  item.products.forEach(function (element) {
    item.amount += element.itemamount;
  });
  req.userCart = item;
  next();

};

exports.processingDeleteUserCart = function (req, res, next) {

  var product = req.body;
  var item = req.cart[0];
  var index = -1;
  item.products.filter(function (obj, i) {
    if (obj.product._id.toString() === product._id.toString()) {
      index = i;
      return;
    }
  });

  item.products.splice(index, 1);
  item.amount = 0;
  item.products.forEach(function (element) {
    item.amount += element.itemamount;
  });
  req.userCart = item;
  next();

};

exports.saveUserCart = function (req, res, next) {

  if (req.cart.length > 0) {
    next();
  } else {
    var cart = new Cart(req.userCart);
    cart.user = req.user;
    cart.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(cart);
      }
    });
  }
};

exports.updateUserCart = function (req, res) {
  var cart = new Cart(req.cart[0]);
  cart = _.extend(cart, req.userCart);
  cart.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cart);
    }
  });
};

exports.sendCart = function (req, res) {
  var cart = req.cart[0] ? req.cart[0].toJSON() : {};

  res.jsonp(cart);
  // res.jsonp(req.cart[0]);
};

exports.cartByID = function (req, res, next) {
  var id = req.id;
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

exports.update = function (req, res) {
  var cart = req.cart;

  cart.products = req.body.products;
  cart.amount = req.body.amount;

  cart.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cart);
    }
  });
};
