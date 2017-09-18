'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Category = mongoose.model('Category'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Category
 */
exports.create = function (req, res) {
  var category = new Category(req.body);
  category.user = req.user;

  category.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(category);
    }
  });
};

/**
 * Show the current Category
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var category = req.category ? req.category.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  category.isCurrentUserOwner = req.user && category.user && category.user._id.toString() === req.user._id.toString();

  res.jsonp(category);
};

/**
 * Update a Category
 */
exports.update = function (req, res) {
  var category = req.category;

  category = _.extend(category, req.body);

  category.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(category);
    }
  });
};

/**
 * Delete an Category
 */
exports.delete = function (req, res) {
  var category = req.category;

  category.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(category);
    }
  });
};

/**
 * List of Categories
 */
exports.list = function (req, res) {
  Category.find().sort('-created').populate('user', 'displayName').exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categories);
    }
  });
};

/**
 * Category middleware
 */
exports.categoryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Category is invalid'
    });
  }

  Category.findById(id).populate('user', 'displayName').exec(function (err, category) {
    if (err) {
      return next(err);
    } else if (!category) {
      return res.status(404).send({
        message: 'No Category with that identifier has been found'
      });
    }
    req.category = category;
    next();
  });
};

/**
 * listOfProducts
 */
exports.listOfProducts = function (req, res, next) {
  Product.find().sort('-created').populate('categories', 'name').populate('shop').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.products = products;
      next();
    }
  });
};

/**
 * listOfCategoies
 */
exports.listOfCategoies = function (req, res, next) {
  Category.find().sort('-created').exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.categories = categories;
      next();
    }
  });
};

/**
 * cookingDataOfCategoies
 */
exports.cookingDataOfCategoies = function (req, res, next) {
  var categories = [];
  var keys = [];
  req.products.forEach(function (product) {
    var productItem = {
      _id: product._id,
      name: product.name,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      price: product.price || 0,
      promotionprice: product.promotionprice || 0,
      percentofdiscount: product.percentofdiscount || 0,
      currency: product.currency,
      rate: 5,
      detail: product.detail
    };
    product.categories.forEach(function (category) {
      if (keys.indexOf(category.name) === -1) {
        keys.push(category.name);
        categories.push({
          name: category.name,
          popularproducts: [productItem],
          bestseller: [productItem],
          lastvisit: [productItem],
          popularshops: [product.shop],
          productvoucher: [{
            'name': 'voucher1',
            'image': 'https://www.iphone-droid.net/wp-content/uploads/2017/03/Lazada-Promotion-1.jpg'
          },
          {
            'name': 'voucher2',
            'image': 'http://news.siamphone.com/upload/news/nw30365/01.jpg'
          },
          {
            'name': 'voucher3',
            'image': 'https://bookings.co.th/wp-content/uploads/Lazada-Birthday-Sale-%E0%B8%9B%E0%B8%B5%E0%B8%97%E0%B8%B5%E0%B9%88-5-%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%82%E0%B8%A1%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99-%E0%B8%88%E0%B8%B1%E0%B8%94-21-23-%E0%B8%A1%E0%B8%B5.%E0%B8%84.2017.png'
          }],
          shopvoucher: [{
            'name': 'voucher4',
            'image': 'https://www.iphone-droid.net/wp-content/uploads/2017/03/Lazada-Promotion-1.jpg'
          },
          {
            'name': 'voucher5',
            'image': 'http://news.siamphone.com/upload/news/nw30365/01.jpg'
          },
          {
            'name': 'voucher6',
            'image': 'https://bookings.co.th/wp-content/uploads/Lazada-Birthday-Sale-%E0%B8%9B%E0%B8%B5%E0%B8%97%E0%B8%B5%E0%B9%88-5-%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%82%E0%B8%A1%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99-%E0%B8%88%E0%B8%B1%E0%B8%94-21-23-%E0%B8%A1%E0%B8%B5.%E0%B8%84.2017.png'
          }]
        });

      } else {

        categories[keys.indexOf(category.name)].popularproducts.push(productItem);
        categories[keys.indexOf(category.name)].popularshops.push(product.shop);
      }
    });
  });
  req.dataOfCategoies = categories;
  next();
};

/**
 * dataOfCategoies
 */
exports.dataOfCategoies = function (req, res) {
  res.jsonp({
    categories: req.dataOfCategoies
  });
};
