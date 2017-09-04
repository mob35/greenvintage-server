'use strict';

/**
 * Module dependencies
 */
var sizemastersPolicy = require('../policies/sizemasters.server.policy'),
  sizemasters = require('../controllers/sizemasters.server.controller');

module.exports = function(app) {
  // Sizemasters Routes
  app.route('/api/sizemasters').all(sizemastersPolicy.isAllowed)
    .get(sizemasters.list)
    .post(sizemasters.create);

  app.route('/api/sizemasters/:sizemasterId').all(sizemastersPolicy.isAllowed)
    .get(sizemasters.read)
    .put(sizemasters.update)
    .delete(sizemasters.delete);

  // Finish by binding the Sizemaster middleware
  app.param('sizemasterId', sizemasters.sizemasterByID);
};
