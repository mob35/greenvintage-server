'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function (app) {
  // Products Routes
  app.route('/api/products')//.all(productsPolicy.isAllowed)
    .get(products.getProductList, products.cookingProductList, products.list)
    .post(products.create);

  app.route('/api/products/:productId')//.all(productsPolicy.isAllowed)
    .get(products.saveHistorylog, products.updateProduct, products.read)
    .put(products.update)
    .delete(products.delete);

  app.route('/api/products/favorite/:productId')//.all(productsPolicy.isAllowed)
    .post(products.createFavorite, products.updateFavoriteProduct, products.read);

  app.route('/api/favoriteproductlist')//.all(productsPolicy.isAllowed)
    .get(products.getFavoriteList, products.cookingFavorite, products.favorites);

  app.route('/api/products/review/:productId')
    .post(products.createReview, products.updateReviewProduct, products.productReview);

  app.route('/api/products/unfavorite/:productId')//.all(productsPolicy.isAllowed)
    .get(products.sliceFavorite, products.removeFavorite, products.read);

  app.route('/api/products/updateimages/:productId')//.all(productsPolicy.isAllowed)
    .post(products.updateImages);

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
};
