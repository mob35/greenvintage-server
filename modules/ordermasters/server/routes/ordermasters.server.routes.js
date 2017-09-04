'use strict';

/**
 * Module dependencies
 */
var ordermastersPolicy = require('../policies/ordermasters.server.policy'),
  ordermasters = require('../controllers/ordermasters.server.controller');

module.exports = function(app) {
  // Ordermasters Routes
  app.route('/api/ordermasters').all(ordermastersPolicy.isAllowed)
    .get(ordermasters.list)
    .post(ordermasters.create);

  app.route('/api/ordermasters/:ordermasterId').all(ordermastersPolicy.isAllowed)
    .get(ordermasters.read)
    .put(ordermasters.update)
    .delete(ordermasters.delete);

  // Finish by binding the Ordermaster middleware
  app.param('ordermasterId', ordermasters.ordermasterByID);
};
