'use strict';

/**
 * Module dependencies
 */
var homesPolicy = require('../policies/homes.server.policy'),
  homes = require('../controllers/homes.server.controller');

module.exports = function (app) {
  // Homes Routes
  app.route('/api/homes').all(homesPolicy.isAllowed)
    .get(homes.getCategory, homes.popular, homes.bestseller, homes.lastvisit, homes.productvoucher, homes.shopvoucher, homes.shoppopular, homes.cookingData, homes.returnData);

  app.route('/api/getproducttop/:keyword').all(homesPolicy.isAllowed)
    .get(homes.getProduct, homes.checkType, homes.returnTopData);
  // .post(homes.create);

  // app.route('/api/homes/:homeId').all(homesPolicy.isAllowed)
  //   .get(homes.read)
  //   .put(homes.update)
  //   .delete(homes.delete);

  // Finish by binding the Home middleware
  app.param('keyword', homes.keywordType);
};
