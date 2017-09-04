'use strict';

/**
 * Module dependencies
 */
var cartmastersPolicy = require('../policies/cartmasters.server.policy'),
  cartmasters = require('../controllers/cartmasters.server.controller');

module.exports = function(app) {
  // Cartmasters Routes
  app.route('/api/cartmasters').all(cartmastersPolicy.isAllowed)
    .get(cartmasters.list)
    .post(cartmasters.create);

  app.route('/api/cartmasters/:cartmasterId').all(cartmastersPolicy.isAllowed)
    .get(cartmasters.read)
    .put(cartmasters.update)
    .delete(cartmasters.delete);

  // Finish by binding the Cartmaster middleware
  app.param('cartmasterId', cartmasters.cartmasterByID);
};
