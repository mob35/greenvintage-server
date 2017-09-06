'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function (app) {
  // Products Routes
  app.route('/api/products')//.all(productsPolicy.isAllowed)
    .post(products.create);

  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read);

  app.route('/api/productsbycategorybyshop/:category_id/:shop_id').all(productsPolicy.isAllowed)
    .get(products.getByConditions, products.resultProducts);

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
  app.param('category_id', products.categoryByID);
  app.param('shop_id', products.shopByID);
};
