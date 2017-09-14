'use strict';

/**
 * Module dependencies
 */
var shopsPolicy = require('../policies/shops.server.policy'),
  shops = require('../controllers/shops.server.controller');

module.exports = function (app) {
  // Shops Routes
  app.route('/api/shops').all(shopsPolicy.isAllowed)
    .get(shops.cookingListShop, shops.list)
    .post(shops.create);

  app.route('/api/shops/:shopId').all(shopsPolicy.isAllowed)
    .get(shops.cookingShopDetail, shops.read)
    .put(shops.update)
    .delete(shops.delete);

  app.route('/api/shop/review/:shopId').all(shopsPolicy.isAllowed)
    .post(shops.createReview, shops.updateReviewShop, shops.cookingShopDetail, shops.read);

  // Finish by binding the Shop middleware
  app.param('shopId', shops.shopByID);
};
