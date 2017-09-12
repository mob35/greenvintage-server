'use strict';

/**
 * Module dependencies
 */
var cartsPolicy = require('../policies/carts.server.policy'),
  carts = require('../controllers/carts.server.controller');

module.exports = function (app) {
  // Carts Routes
  app.route('/api/carts')//.all(cartsPolicy.isAllowed)
    .get(carts.list)
    .post(carts.cartID, carts.update, carts.create, carts.readCart);

  app.route('/api/carts/:cartId')//.all(cartsPolicy.isAllowed)
    .get(carts.read)
    .put(carts.update)
    .delete(carts.delete);

  app.route('/api/cart/user/:userId')//.all(cartsPolicy.isAllowed)
    .get(carts.readCart);

  // Finish by binding the Cart middleware
  app.param('cartId', carts.cartByID);
  app.param('userId', carts.cartByUserID);

};
