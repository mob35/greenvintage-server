'use strict';

/**
 * Module dependencies
 */
var ordersPolicy = require('../policies/orders.server.policy'),
  orders = require('../controllers/orders.server.controller');

module.exports = function (app) {
  // Orders Routes
  app.route('/api/orders')//.all(ordersPolicy.isAllowed)
    .get(orders.list)
    .post(orders.create, orders.findCart, orders.clearCart);


  app.route('/api/getordersbyshop').all(ordersPolicy.isAllowed)
    .get(orders.listshops, orders.listordershop, orders.cookinglistordershop);

  app.route('/api/updateorderaccept/:orderId').all(ordersPolicy.isAllowed)
    .put(orders.updateorderaccept);

  app.route('/api/updateordersent/:orderId').all(ordersPolicy.isAllowed)
    .put(orders.updateordersent);

  app.route('/api/updateordercomplete/:orderId').all(ordersPolicy.isAllowed)
    .put(orders.updateordercomplete);

  app.route('/api/updateorderreject/:orderId').all(ordersPolicy.isAllowed)
    .put(orders.updateorderreject);

  app.route('/api/updateorderreturn/:orderId').all(ordersPolicy.isAllowed)
    .put(orders.updateorderreturn);

  app.route('/api/orders/:orderId').all(ordersPolicy.isAllowed)
    .get(orders.read)
    .put(orders.update)
    .delete(orders.delete);

  // Finish by binding the Order middleware
  app.param('orderId', orders.orderByID);
};
