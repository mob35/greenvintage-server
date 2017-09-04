'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Productmaster = mongoose.model('Productmaster'),
  productList,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.getProduct = function (req, res, next) {
  req.categorys = [];
  var startdate = new Date();
  startdate.setDate(1);
  startdate.setHours(0, 0, 0);
  var enddate = new Date(new Date(startdate.getFullYear(), startdate.getMonth() + 1, 0).setHours(23, 59, 59, 999));

  Productmaster.find({ created: { $gte: startdate, $lte: enddate } }).sort('-created').populate('user', 'displayName').populate('category').populate('shop').exec(function (err, productmasters) {
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

exports.createSlides = function (req, res, next) {
  // var slide = [null, '1', '2', 'ggt'];
  var products = fliterCategory(req.products, null);
  var productPopular = createPopular(products);
  var productSeller = bestSeller(products);
  var popularshops = shopPopular();
  var lastvisitProduct = getLastvisit(products, req.user);
  req.categorys.push({
    productpopular: productPopular,
    bestseller: productSeller,
    popularshops: popularshops,
    lastvisit: lastvisitProduct,
    productvoucher: [{
      "name": "voucher1",
      "image": "https://www.iphone-droid.net/wp-content/uploads/2017/03/Lazada-Promotion-1.jpg"
    },
    {
      "name": "voucher2",
      "image": "http://news.siamphone.com/upload/news/nw30365/01.jpg"
    },
    {
      "name": "voucher3",
      "image": "https://bookings.co.th/wp-content/uploads/Lazada-Birthday-Sale-%E0%B8%9B%E0%B8%B5%E0%B8%97%E0%B8%B5%E0%B9%88-5-%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%82%E0%B8%A1%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99-%E0%B8%88%E0%B8%B1%E0%B8%94-21-23-%E0%B8%A1%E0%B8%B5.%E0%B8%84.2017.png"
    }],
    shopvoucher: [{
      "name": "voucher4",
      "image": "https://www.iphone-droid.net/wp-content/uploads/2017/03/Lazada-Promotion-1.jpg"
    },
    {
      "name": "voucher5",
      "image": "http://news.siamphone.com/upload/news/nw30365/01.jpg"
    },
    {
      "name": "voucher6",
      "image": "https://bookings.co.th/wp-content/uploads/Lazada-Birthday-Sale-%E0%B8%9B%E0%B8%B5%E0%B8%97%E0%B8%B5%E0%B9%88-5-%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%82%E0%B8%A1%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99-%E0%B8%88%E0%B8%B1%E0%B8%94-21-23-%E0%B8%A1%E0%B8%B5.%E0%B8%84.2017.png"
    }]
  });
  next();
};

exports.returnData = function (req, res) {
  res.jsonp({ categorys: req.categorys });
};

function sliceItem(products) {
  return products.slice(0, 6);
}

function fliterCategory(products, cateId) {
  var category = products;
  if (cateId !== null) {
    category = products.filter(function (obj) { return obj.category.parent.toString() === cateId.toString(); });
  }
  return category;
}

function createPopular(products) {
  var popular = products.sort(function (a, b) { return (a.historylog.length < b.historylog.length) ? 1 : ((b.historylog.length < a.historylog.length) ? -1 : 0); });
  var setPopular = sliceItem(popular);
  return setPopular;
}

function bestSeller(products) {
  for (var i = 0; i < products.length; i++) {
    products[i].sellerSummary = 0;
    for (var ii = 0; ii < products[i].sellerlog.length; ii++) {
      products[i].sellerSummary += products[i].sellerlog[ii].qty;
    }
  }
  var bestseller = products.sort(function (a, b) { return (a.sellerSummary < b.sellerSummary) ? 1 : ((b.sellerSummary < a.sellerSummary) ? -1 : 0); });
  productList = bestseller;
  var setBestseller = sliceItem(bestseller);
  return setBestseller;
}

function shopPopular() {
  var shops = [];
  for (var i = 0; i < productList.length; i++) {
    var indexOf = arrayObjectIndexOf(shops, productList[i].shop._id, "_id");
    var shop = productList[i].shop;
    if (indexOf === -1) {
      shop.sellerSummary = productList[i].sellerSummary;
      shops.push(shop);
    } else {
      shops[indexOf].sellerSummary += productList[i].sellerSummary;
    }
  }
  var shopsPopular = shops.sort(function (a, b) { return (a.sellerSummary < b.sellerSummary) ? 1 : ((b.sellerSummary < a.sellerSummary) ? -1 : 0); });

  var setShopPopular = sliceItem(shopsPopular);

  return setShopPopular;

}

function arrayObjectIndexOf(myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}

function getLastvisit(products, user) {

  var myLastVisit = products.filter(function (obj) {
    return (obj.historylog.filter(function (obj2) {
      return obj2.user.toString() === user._id.toString();
    })).length > 0;
  });

  for (var i = 0; i < myLastVisit.length; i++) {
    for (var ii = 0; ii < myLastVisit[i].historylog.length; ii++) {
      if (myLastVisit[i].historylog[ii].user.toString() !== user._id.toString()) {
        myLastVisit[i].historylog.splice(ii, 1);
      }
    }

  }
  var lastvisit = myLastVisit.sort(function (a, b) {

    // console.log('cookingLastvisitB' + cookingLastvisitB);

    var lastvisitA = a.historylog.sort(function (aa, bb) {
      return (new Date(aa.date) < new Date(bb.date)) ? 1 : ((new Date(bb.date) < new Date(aa.date)) ? -1 : 0);
    });
    // console.log('lastvisitA' + lastvisitA);
    var lastvisitB = b.historylog.sort(function (aa, bb) {
      return (new Date(aa.date) < new Date(bb.date)) ? 1 : ((new Date(bb.date) < new Date(aa.date)) ? -1 : 0);
    });
    // console.log('lastvisitB' + lastvisitB);

    return lastvisitA.length > 0 && lastvisitB.length > 0 ? (new Date(lastvisitA[0].date) < new Date(lastvisitB[0].date)) ? 1 : ((new Date(lastvisitB[0].date) < new Date(lastvisitA[0].date)) ? -1 : 0) : 0;

  });
  var setLastVisit = sliceItem(lastvisit);
  // console.log(lastvisit);
  return setLastVisit;
}