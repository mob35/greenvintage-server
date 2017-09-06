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
  var slide = [{ id: null, name: 'ไฮไลท์' }, { id: '1', name: 'เครื่องใช้ไฟฟ้า' }];
  for (var i = 0; i < slide.length; i++) {
    var products = fliterCategory(req.products, slide[i].id);
    var productPopular = createPopular(products, 6);
    var productSeller = bestSeller(products, 6);
    var popularshops = shopPopular(6);
    var lastvisitProduct = getLastvisit(products, req.user, 6);
    req.categorys.push({
      name: slide[i].name,
      popularproducts: productPopular,
      bestseller: productSeller,
      popularshops: popularshops,
      lastvisit: lastvisitProduct,
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
  }
  next();
};

exports.returnData = function (req, res) {
  res.jsonp({ categories: req.categorys });
};

exports.keywordType = function (req, res, next, keyword) {
  req.keyword = keyword;
  next();
};

exports.checkType = function (req, res, next) {
  var topProducts = [];
  console.log(req.products);
  if (req.keyword.toString() === 'bestseller') {
    topProducts = bestSeller(req.products, 20);
  } else if (req.keyword.toString() === 'popular') {
    topProducts = createPopular(req.products, 20);
  }
  req.topProducts = topProducts;
};

exports.returnTopData = function (req, res) {
  res.jsonp(req.topProducts);
};

function sliceItem(products, number) {
  return products.slice(0, number);
}

function fliterCategory(products, cateId) {
  var category = products;
  if (cateId !== null) {
    category = products.filter(function (obj) { return obj.category.parent.toString() === cateId.toString(); });
  }
  return category;
}

function createPopular(products, number) {
  var popular = products.sort(function (a, b) { return (a.historylog.length < b.historylog.length) ? 1 : ((b.historylog.length < a.historylog.length) ? -1 : 0); });
  var setPopular = sliceItem(popular, number);
  return setPopular;
}

function bestSeller(products, number) {
  for (var i = 0; i < products.length; i++) {
    products[i].sellerSummary = 0;
    for (var ii = 0; ii < products[i].sellerlog.length; ii++) {
      products[i].sellerSummary += products[i].sellerlog[ii].qty;
    }
  }
  var bestseller = products.sort(function (a, b) { return (a.sellerSummary < b.sellerSummary) ? 1 : ((b.sellerSummary < a.sellerSummary) ? -1 : 0); });
  productList = bestseller;
  var setBestseller = sliceItem(bestseller, number);
  return setBestseller;
}

function shopPopular(number) {
  var shops = [];
  for (var i = 0; i < productList.length; i++) {
    var indexOf = arrayObjectIndexOf(shops, productList[i].shop._id, '_id');
    var shop = productList[i].shop;
    if (indexOf === -1) {
      shop.sellerSummary = productList[i].sellerSummary;
      shops.push(shop);
    } else {
      shops[indexOf].sellerSummary += productList[i].sellerSummary;
    }
  }
  var shopsPopular = shops.sort(function (a, b) { return (a.sellerSummary < b.sellerSummary) ? 1 : ((b.sellerSummary < a.sellerSummary) ? -1 : 0); });

  var setShopPopular = sliceItem(shopsPopular, number);

  return setShopPopular;

}

function arrayObjectIndexOf(myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}

function getLastvisit(products, user, number) {
  if (user && user !== undefined) {
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
    var setLastVisit = sliceItem(lastvisit, number);
    // console.log(lastvisit);
    return setLastVisit;
  } else {
    return [];
  }

}