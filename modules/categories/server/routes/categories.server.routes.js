'use strict';

/**
 * Module dependencies
 */
var categoriesPolicy = require('../policies/categories.server.policy'),
  categories = require('../controllers/categories.server.controller');

module.exports = function (app) {
  // Categories Routes
  app.route('/api/categories')//.all(categoriesPolicy.isAllowed)
    .get(categories.list)
    .post(categories.create);

  app.route('/api/categories/:categoryId')//.all(categoriesPolicy.isAllowed)
    .get(categories.read)
    .put(categories.update)
    .delete(categories.delete);

  // Home data of categories Routes
  app.route('/api/dataofcategories')
    .get(categories.listOfProducts,
      //categories.listOfCategoies,
      categories.cookingDataOfCategoies,
      categories.dataOfCategoies);

  // Finish by binding the Category middleware
  app.param('categoryId', categories.categoryByID);
};
