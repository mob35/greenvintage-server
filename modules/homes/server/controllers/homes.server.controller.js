'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Productmaster = mongoose.model('Productmaster'),
  Categorymaster = mongoose.model('Categorymaster'),
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

exports.getCategory = function (req, res, next) {
  req.categorys = [];
  var startdate = new Date();
  startdate.setDate(1);
  startdate.setHours(0, 0, 0);
  var enddate = new Date(new Date(startdate.getFullYear(), startdate.getMonth() + 1, 0).setHours(23, 59, 59, 999));
  req.startdate = startdate;
  req.enddate = enddate;
  Categorymaster.find({}, '_id name detail').sort().exec(function (err, categorys) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.categorys = categorys;
      next();
    }
  });
};

exports.popular = function (req, res, next) {

  Productmaster.find({ historylog: { $elemMatch: { date: { $gte: new Date(req.startdate), $lte: new Date(req.enddate) } } } }, '_id name image price category historylog shop').sort('-created').populate('category').populate('shop').exec(function (err, productmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(productmasters);
      req.populars = productmasters;
      next();
    }
  });
};

exports.bestseller = function (req, res, next) {

  Productmaster.find({ sellerlog: { $elemMatch: { date: { $gte: new Date(req.startdate), $lte: new Date(req.enddate) } } } }, '_id name image price category sellerlog').sort('-created').populate('category').exec(function (err, productmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(productmasters);
      req.bestseller = productmasters;
      next();
    }
  });
};

exports.lastvisit = function (req, res, next) {
  Productmaster.find({ historylog: { $elemMatch: { date: { $gte: new Date(req.startdate), $lte: new Date(req.enddate) } } } }, '_id name image price category historylog').sort('-created').populate('category').exec(function (err, productmasters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.lastvisit = productmasters;
      next();
    }
  });
};

exports.productvoucher = function (req, res, next) {
  req.productvoucher = [
    {
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
    }
  ];
  next();
};

exports.shopvoucher = function (req, res, next) {
  req.shopvoucher = [
    {
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
    }
  ];
  next();
};

exports.shoppopular = function (req, res, next) {
  req.shoppopular = [];
  // req.populars.forEach(function (shoppop) {
  //   req.shoppopular.push({
  //     name: shoppop.shop.name,
  //     image: shoppop.shop.image
  //   });
  // });
  next();
};

exports.cookingData = function (req, res, next) {
  // var populars = req.populars.filter(function (obj) { return obj.category._id.toString() === req.getcategorys[i]._id.toString(); });
  var _categorys = [];
  req.categorys.forEach(function (category) {
    var _category = {
      name: category.name,
      detail: category.detail,
      popularproducts: [],
      bestseller: [],
      lastvisit: [],
      shopvoucher: req.shopvoucher,
      productvoucher: req.productvoucher,
      popularshops: []
    };


    req.populars.forEach(function (popular) {
      // var historylog = [];
      // if(){

      // }
      if (popular.category._id.toString() === category._id.toString()) {

        _category.popularproducts.push({
          _id: popular._id,
          name: popular.name,
          image: popular.image && popular.image.length > 0 ? popular.image[0].url : 'default image',
          price: popular.price
        });
        if (_category.popularshops.length > 0) {
          var chk = true;
          _category.popularshops.forEach(function (shop) {
            if (shop.name.toString() === popular.shop.name.toString()) {
              chk = false;
            }
          });
          if (chk) {
            _category.popularshops.push({
              _id: popular.shop._id,
              name: popular.shop.name,
              image: popular.shop.image
            });
          }
        } else {
          _category.popularshops.push({
            _id: popular.shop._id,
            name: popular.shop.name,
            image: popular.shop.image
          });
        }

      }
    });

    req.bestseller.forEach(function (best) {
      if (best.category._id.toString() === category._id.toString()) {

        _category.bestseller.push({
          _id: best._id,
          name: best.name,
          image: best.image && best.image.length > 0 ? best.image[0].url : 'default image',
          price: best.price
        });
      }
    });

    req.lastvisit.forEach(function (last) {
      if (last.category._id.toString() === category._id.toString()) {
        _category.lastvisit.push({
          _id: last._id,
          name: last.name,
          image: last.image && last.image.length > 0 ? last.image[0].url : 'default image',
          price: last.price
        });
      }
    });
    // _category.popularproducts.filter(function (obj) { return obj.category._id.toString() === req.getcategorys[i]._id.toString(); });
    _categorys.push(_category);
    // console.log(_categorys);
  });
  req.categorys = _categorys;
  next();
};

exports.returnData = function (req, res) {
  res.jsonp({ categories: req.categorys });
};


///////////////////////////////////////////////////////////

exports.keywordType = function (req, res, next, keyword) {
  req.keyword = keyword;
  next();
};

exports.checkType = function (req, res, next) {
  var topProducts = [];
  if (req.keyword.toString() === 'bestseller') {
    topProducts = bestSeller(req.products, 20);
  } else if (req.keyword.toString() === 'popular') {
    topProducts = createPopular(req.products, 20);
  }
  req.topProducts = topProducts;
  next();
};

exports.returnTopData = function (req, res) {
  res.jsonp(req.topProducts);
};


/////////////////////////////////////////////////////////

function sliceItem(products, number) {
  return products.slice(0, number);
}

function fliterCategory(products, cateId) {
  var category = products;
  if (cateId !== null) {
    // console.log(cateId);
    category = products.filter(function (obj) {
      // console.log(obj.category._id);
      return obj.category._id.toString() === cateId.toString();
    });
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
    var productHistorylog = products.filter(function (obj) {
      return obj.historylog.length > 0 === true;
    });
    if (productHistorylog && productHistorylog.length > 0) {

      var myLastVisit = productHistorylog.filter(function (obj) {
        return (obj.historylog.filter(function (obj2) {
          return obj2.user ? obj2.user.toString() === user._id.toString() : false;
        })).length > 0;
      });

      for (var i = 0; i < myLastVisit.length; i++) {
        for (var ii = 0; ii < myLastVisit[i].historylog.length; ii++) {
          if (myLastVisit[i].historylog[ii].user && myLastVisit[i].historylog[ii].user !== undefined) {
            if (myLastVisit[i].historylog[ii].user.toString() !== user._id.toString()) {
              myLastVisit[i].historylog.splice(ii, 1);
            }
          } else {
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
  } else {
    return [];
  }

}