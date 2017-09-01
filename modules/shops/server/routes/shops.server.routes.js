'use strict';

/**
 * Module dependencies
 */
var shopsPolicy = require('../policies/shops.server.policy'),
  shops = require('../controllers/shops.server.controller');

module.exports = function (app) {
  // Shops Routes
  app.route('/api/shops').all(shopsPolicy.isAllowed)
    .post(shops.create);

  app.route('/api/shops/:shopId').all(shopsPolicy.isAllowed)
    .get(shops.read);

  // Finish by binding the Shop middleware
  app.param('shopId', shops.shopByID);
};
