'use strict';

/**
 * Module dependencies
 */
var cartsPolicy = require('../policies/carts.server.policy'),
  carts = require('../controllers/carts.server.controller');

module.exports = function (app) {
  // Manage carts Routes
  app.route('/api/carts/add')
    .post(carts.findUserCart, carts.processingAddUserCart, carts.saveUserCart, carts.updateUserCart);

  app.route('/api/carts/remove')
    .post(carts.findUserCart, carts.processingRemoveUserCart, carts.updateUserCart);

  app.route('/api/carts/delete')
    .post(carts.findUserCart, carts.processingDeleteUserCart, carts.updateUserCart);

  app.route('/api/carts/get-by-user/:manageCartId')
    .get(carts.findUserCart, carts.sendCart)
    .put(carts.cartByID, carts.update);

  // .all(cartsPolicy.isAllowed)
  // Finish by binding the Manage cart middleware
  app.param('manageCartId', carts.manageCartByID);
};
