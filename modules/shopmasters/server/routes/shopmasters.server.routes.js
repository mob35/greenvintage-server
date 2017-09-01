'use strict';

/**
 * Module dependencies
 */
var shopmastersPolicy = require('../policies/shopmasters.server.policy'),
  shopmasters = require('../controllers/shopmasters.server.controller');

module.exports = function(app) {
  // Shopmasters Routes
  app.route('/api/shopmasters').all(shopmastersPolicy.isAllowed)
    .get(shopmasters.list)
    .post(shopmasters.create);

  app.route('/api/shopmasters/:shopmasterId').all(shopmastersPolicy.isAllowed)
    .get(shopmasters.read)
    .put(shopmasters.update)
    .delete(shopmasters.delete);

  // Finish by binding the Shopmaster middleware
  app.param('shopmasterId', shopmasters.shopmasterByID);
};
