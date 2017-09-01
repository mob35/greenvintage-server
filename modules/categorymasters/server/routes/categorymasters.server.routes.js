'use strict';

/**
 * Module dependencies
 */
var categorymastersPolicy = require('../policies/categorymasters.server.policy'),
  categorymasters = require('../controllers/categorymasters.server.controller');

module.exports = function(app) {
  // Categorymasters Routes
  app.route('/api/categorymasters').all(categorymastersPolicy.isAllowed)
    .get(categorymasters.list)
    .post(categorymasters.create);

  app.route('/api/categorymasters/:categorymasterId').all(categorymastersPolicy.isAllowed)
    .get(categorymasters.read)
    .put(categorymasters.update)
    .delete(categorymasters.delete);

  // Finish by binding the Categorymaster middleware
  app.param('categorymasterId', categorymasters.categorymasterByID);
};
