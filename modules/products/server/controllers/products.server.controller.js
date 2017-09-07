'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Productmaster = mongoose.model('Productmaster'),
  cloudinary = require(path.resolve('./config/lib/cloudinary')).cloudinary,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
////////////////////////////////// cloudinary process//////////////////////////////////////////
function uploadCloudinary(imgs) {
  return new Promise((resolve, reject) => {
    if (imgs.length <= 0) {
      resolve(null);
    } else {
      var cloudinaryImgs = [];
      for (var i = 0; i < imgs.length; i++) {
        cloudinary.v2.uploader.upload(imgs[i],
          { public_id: new Date() + '_' + i }, function (error, result) {
            if (error) {
              reject(error);
            } else {
              cloudinaryImgs.push({
                id: result.public_id,
                url: result.secure_url
              });
              if (cloudinaryImgs.length == imgs.length) {
                resolve(cloudinaryImgs);
              }
            }
          });
      }
    }
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////
exports.create = function (req, res) {
  console.log('===================================pass 1================');
  uploadCloudinary(req.body.image).then(imgs => {
    console.log('==========================APP=============================');
    console.log(imgs);
    console.log('==========================================================');
    req.body.user = req.user;
    req.body.image = imgs;
    var productmaster = new Productmaster(req.body);
    productmaster.save(function (err, result) {
      if (err) {
  console.log('===================================pass 2================');  
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(result);
      }
    });
  }).catch(err => {
  console.log('===================================pass 3================');  
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.productmaster ? req.productmaster.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Productmaster is invalid'
    });
  }

  Productmaster.findById(id).populate('user', 'displayName').populate('shop').populate('category').populate('size').populate('shippings.shipping').exec(function (err, productmaster) {
    if (err) {
      return next(err);
    } else if (!productmaster) {
      return res.status(404).send({
        message: 'No Productmaster with that identifier has been found'
      });
    }
    req.productmaster = productmaster;
    next();
  });
};

exports.categoryByID = function (req, res, next, id) {
  req.categoryId = id;
  next();
};

exports.shopByID = function (req, res, next, id) {
  req.shopId = id;
  next();
};

exports.getByConditions = function (req, res, next) {
  var filter = {};
  if (req.categoryId !== 'all' && req.shopId === 'all') {
    filter = { category: req.categoryId };
  } else if (req.categoryId === 'all' && req.shopId !== 'all') {
    filter = { shop: req.shopId };
  } else if (req.categoryId !== 'all' && req.shopId !== 'all') {
    filter = { category: req.categoryId, shop: req.shopId };
  }
  Productmaster.find(filter).populate('user', 'displayName').populate('shop').populate('category').populate('size').populate('shippings.shipping').exec(function (err, productmaster) {
    if (err) {
      return next(err);
    } else if (!productmaster) {
      return res.status(404).send({
        message: 'No Productmaster with that identifier has been found'
      });
    }
    req.productsByConditions = productmaster;
    next();
  });
};


exports.resultProducts = function (req, res) {
  res.jsonp(req.productsByConditions);
};