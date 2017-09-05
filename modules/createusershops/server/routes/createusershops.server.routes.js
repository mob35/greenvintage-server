'use strict';

/**
 * Module dependencies
 */
var createusershopsPolicy = require('../policies/createusershops.server.policy'),
  createusershops = require('../controllers/createusershops.server.controller');

module.exports = function (app) {
  // Createusershops Routes
  app.route('/api/createusershops')
    .post(createusershops.createUser, createusershops.createShop, createusershops.updateUserShopCreate);
};
