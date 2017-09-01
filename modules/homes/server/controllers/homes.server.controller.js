'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Productmaster = mongoose.model('Productmaster'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.setDefault = function (req, res, next) {
  req.categorys = [];
  next();
};

exports.getProduct = function (req, res, next) {
  var startdate = new Date();
  startdate.setDate(1);
  startdate.setHours(0, 0, 0);
  var enddate = new Date(new Date(startdate.getFullYear(), startdate.getMonth() + 1, 0).setHours(23, 59, 59, 999));

  Productmaster.find({ created: { $gte: startdate, $lte: enddate } }).sort('-created').populate('user', 'displayName').populate('category').exec(function (err, productmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.products = productmasters;
      next();
    }
  });
};

exports.createHilight = function (req, res, next) {
  var products = fliterCategory(req.products, null);
  var productPopular = createPopular(products);
  req.categorys.push({
    productpopular: productPopular
  });
  next();
};

exports.returnData = function (req, res) {
  res.jsonp({ categorys: req.categorys });
};

function fliterCategory(products, cateId) {
  var category = products;
  if (cateId !== null) {
    category = products.filter(function (obj) { return obj.category.parent.toString() === cateId.toString(); });
  }
  return category;
}

function createPopular(products) {
  var popular = products.sort(function (a, b) { return (a.historylog.length < b.historylog.length) ? 1 : ((b.historylog.length < a.historylog.length) ? -1 : 0); });
  return popular.slice(0, 6);
}