'use strict';

/**
 * Module dependencies
 */
var ordersPolicy = require('../policies/orders.server.policy'),
  orders = require('../controllers/orders.server.controller');

module.exports = function (app) {
  // Orders Routes
  app.route('/api/ordersbyshop').all(ordersPolicy.isAllowed)
    .get(orders.getOrderByshop, orders.filterStatus, orders.resultOrders);
  //   .post(orders.create);

  // app.route('/api/orders/:orderId').all(ordersPolicy.isAllowed)
  //   .get(orders.read)
  //   .put(orders.update)
  //   .delete(orders.delete);

  // // Finish by binding the Order middleware
  // app.param('orderId', orders.orderByID);
};