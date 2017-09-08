'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Productmaster = mongoose.model('Productmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Productmaster
 */
exports.create = function (req, res) {
  var productmaster = new Productmaster(req.body);
  productmaster.user = req.user;

  productmaster.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(productmaster);
    }
  });
};

/**
 * Show the current Productmaster
 */

exports.read = function (req, res) {
  // convert mongoose document to JSON
  var productmaster = req.productmaster ? req.productmaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  productmaster.isCurrentUserOwner = req.user && productmaster.user && productmaster.user._id.toString() === req.user._id.toString();

  res.jsonp(productmaster);
};

/**
 * Update a Productmaster
 */
exports.update = function (req, res) {
  var productmaster = req.productmaster;

  productmaster = _.extend(productmaster, req.body);

  productmaster.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(productmaster);
    }
  });
};

/**
 * Delete an Productmaster
 */
exports.delete = function (req, res) {
  var productmaster = req.productmaster;

  productmaster.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(productmaster);
    }
  });
};

/**
 * List of Productmasters
 */
exports.list = function (req, res) {
  Productmaster.find().sort('-created').populate('user', 'displayName').populate('shop').populate('category').populate('size').populate('shippings.shipping').exec(function (err, productmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(productmasters);
    }
  });
};

/**
 * Productmaster middleware
 */
exports.productmasterByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Productmaster is invalid'
    });
  }

  Productmaster.findById(id)
    .populate('user')
    .populate('shop')
    .populate('category')
    .populate('size')
    .populate('shippings.shipping')
    .exec(function (err, productmaster) {
      if (err) {
        return next(err);
      } else if (!productmaster) {
        return res.status(404).send({
          message: 'No Productmaster'
        });
      }
      req.productmaster = productmaster;
      next();
    });
};

exports.productDetail = function (req, res, next) {
  res.jsonp({
    'id': req.productmaster._id,
    'name': req.productmaster.name,
    'detail': req.productmaster.detail,
    'price': req.productmaster.price,
    'image': req.productmaster.image,
    'review': req.productmaster.review,
    'rate': req.productmaster.rate,
    'qa': req.productmaster.qa,
    'promotions': req.productmaster.promotions,
    'favorite': req.productmaster.favorite,
    'stock': req.productmaster.stock,
    'qty': req.productmaster.qty,
    'issize': req.productmaster.issize,
    'size': req.productmaster.size,
    'category': req.productmaster.category,
    'payment': req.productmaster.payment,
    'shipping': req.productmaster.shipping,
    'shop': {
      'shop': req.productmaster.shop.name,
      'rate': req.productmaster.shop.rate
    },
    'relationProducts': [
      {
        'name': 'NIKE',
        'image': 'https://assets.wired.com/photos/w_1534/wp-content/uploads/2016/09/ff_nike-hyperadapt_angle_front.jpg',
        'price': 100
      },
      {
        'name': 'ADIDAS',
        'image': 'http://th-live-01.slatic.net/p/7/adidas-men-run-shoe-duramo8-bb4656-2290-1493865078-91437671-31f932a8c992f98dc9ba8c6b4dec3f6e-catalog_233.jpg',
        'price': 100
      },
      {
        'name': 'PUMA',
        'image': 'http://gadgets.siamsport.co.th/wp-content/uploads/puma-nrgy-sneakers.jpg',
        'price': 100
      },
      {
        'name': 'ONITSUKA',
        'image': 'https://th-live-02.slatic.net/p/7/onitsuka-tiger-womens-serrano-shoes-d471l-1494928131-7120789-b60f98a3253f8a5230b4a0cf110588e1.jpg',
        'price': 100
      }
    ],
    'title': req.productmaster.detail
  });
};

exports.productsBytitle = function (req, res, next, title) {
  req.title = title;
  next();
};

exports.getProductlist = function (req, res, next) {
  var filter = {};
  if (req.user && req.user.shop && req.user.shop !== undefined) {
    filter = { shop: req.user.shop };
  }
  Productmaster.find(filter).sort('-created').exec(function (err, productmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // res.jsonp(productmasters);
      req.productlist = productmasters;
      next();
    }
  });
};

exports.cookingProductlist = function (req, res, next) {
  var productmaster = req.productlist;
  var items = [];
  productmaster.forEach(function (item) {
    console.log(item);
    items.push({
      _id: item._id,
      name: item.name,
      image: item.image && item.image.length > 0 ? item.image[0].url : 'not found image',
      price: item.price,
      normalprice: item.price,
      discount: 0,
      discounttype: '%',
      currency: 'THB',
      rate: 0,

    });
  });
  req.productlist = items;
  next();
};

exports.getProductsBytitle = function (req, res) {
  res.jsonp({
    title: req.title,
    items: req.productlist
  });
};