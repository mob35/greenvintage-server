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

  var shop = req.user.shop ? req.user.shop : '';
  Ordermaster.find({ $and: [{ status: { $ne: 'confirm' } }, { status: { $ne: 'cancel' } }] }).sort('-created').populate('user', 'displayName').populate('shipping').populate({
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
  var orders = {
    waiting: [],
    accept: [],
    sent: [],
    return: []
  };
  req.orders.forEach(function (items) {
    items.items.forEach(function (itm) {
      if (itm.status.toString() === 'waiting') {
        if (itm.product.shop._id.toString() === req.user.shop.toString()) {
          orders.waiting.push({
            order_id: items._id,
            item_id: itm._id,
            name: itm.product.name,
            price: itm.product.price,
            qty: itm.qty,
            rate: 5,
            image: itm.product.image && itm.product.image.length > 0 ? itm.product.image[0].url : 'default image',
            status: itm.status
          });
        }
      } else if (itm.status.toString() === 'accept') {
        if (itm.product.shop._id.toString() === req.user.shop.toString()) {
          orders.accept.push({
            order_id: items._id,
            item_id: itm._id,
            name: itm.product.name,
            price: itm.product.price,
            qty: itm.qty,
            rate: 5,
            image: itm.product.image && itm.product.image.length > 0 ? itm.product.image[0].url : 'default image',
            status: itm.status
          });
        }
      } else if (itm.status.toString() === 'sent') {
        if (itm.product.shop._id.toString() === req.user.shop.toString()) {
          orders.sent.push({
            order_id: items._id,
            item_id: itm._id,
            name: itm.product.name,
            price: itm.product.price,
            qty: itm.qty,
            rate: 5,
            image: itm.product.image && itm.product.image.length > 0 ? itm.product.image[0].url : 'default image',
            status: itm.status
          });
        }
      } else if (itm.status.toString() === 'return') {
        if (itm.product.shop._id.toString() === req.user.shop.toString()) {
          orders.return.push({
            order_id: items._id,
            item_id: itm._id,
            name: itm.product.name,
            price: itm.product.price,
            qty: itm.qty,
            rate: 5,
            image: itm.product.image && itm.product.image.length > 0 ? itm.product.image[0].url : 'default image',
            status: itm.status
          });
        }
      }
    });
  });

  // "order_id": "59af742be20930c8298b14f9",
  //   "item_id": "59af742be20930c8298b14f9",
  //     "name": "Productmaster getorder",
  //       "price": 1234,
  //         "qty": 3,
  //           "rate": 5,
  //             "image": "http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg",
  //               "status": "waiting"
  req.orders = orders;
  next();
};

exports.resultOrders = function (req, res) {
  res.jsonp(req.orders);
};

exports.createOrder = function (req, res, next) {
  var order = new Ordermaster(req.body);
  order.user = req.user;
  // console.log(order);
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

exports.orderByID = function (req, res, next, orderId) {
  req.order_id = orderId;
  Ordermaster.findById(req.order_id).sort('-created').populate('user', 'displayName').populate('shipping').populate({
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
      req.orders = ordermasters;
      next();
    }
  });
};

exports.orderByitemID = function (req, res, next, itemId) {
  req.orders.forEach(function (order) {
    order.items.forEach(function (itm) {
      if (itm._id.toString() === req.item_id.toString()) {
        req.item = itm;
      }
    });
  });
  next();
};

exports.read = function (req, res, next) {
  res.jsonp({
    order_id: req.order_id,
    item_id: req.item_id,
    name: req.item.product.name,
    price: req.item.product.price,
    image: req.item.product.image,
    shipping: req.item.shipping,
    delivery: req.item.delivery
  });
};

exports.getorder = function (req, res, next) {
  Ordermaster.find({ $and: [{ status: { $ne: 'confirm' } }, { status: { $ne: 'cancel' } }] }).populate('items.product').exec(function (err, ordermaster) {
    req.orders = ordermaster;
    next();
  });
};

exports.orderlistbyshops = function (req, res) {
  var itemsWaiting = [];
  var itemsAccept = [];
  var itemsSent = [];
  var itemsReturn = [];
  // console.log(req.user);
  req.orders.forEach(function (order) {
    order.items.forEach(function (item) {
      if (item.product.shop.toString() === req.user.shop.toString() || true) {
        if (item.status === 'waiting') {
          itemsWaiting.push({
            order_id: order._id,
            item_id: item._id,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty,
            image: item.product.image && item.product.image.length > 0 ? item.product.image[0].url : 'No Image',
            status: item.status
          });
        } else if (item.status === 'accept') {
          itemsAccept.push({
            order_id: order._id,
            item_id: item._id,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty,
            image: item.product.image && item.product.image.length > 0 ? item.product.image[0].url : 'No Image',
            status: item.status
          });
        } else if (item.status === 'sent') {
          itemsSent.push({
            order_id: order._id,
            item_id: item._id,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty,
            image: item.product.image && item.product.image.length > 0 ? item.product.image[0].url : 'No Image',
            status: item.status
          });
        } else if (item.status === 'return') {
          itemsReturn.push({
            order_id: order._id,
            item_id: item._id,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty,
            image: item.product.image && item.product.image.length > 0 ? item.product.image[0].url : 'No Image',
            status: item.status
          });
        }
      }
    });
  });

  res.jsonp({
    waiting: itemsWaiting,
    accept: itemsAccept,
    sent: itemsSent,
    return: itemsReturn
  });
};