'use strict';

/**
 * Module dependencies
 */
var productmastersPolicy = require('../policies/productmasters.server.policy'),
    productmasters = require('../controllers/productmasters.server.controller');

module.exports = function(app) {
    // Productmasters Routes
    app.route('/api/productmasters').all(productmastersPolicy.isAllowed)
        .get(productmasters.list)
        .post(productmasters.create);

    app.route('/api/productmasters/:productmasterId').all(productmastersPolicy.isAllowed)
        .get(productmasters.productDetail)
        .put(productmasters.update)
        .delete(productmasters.delete);

    app.route('/api/productlistbytitle/:title').all(productmastersPolicy.isAllowed)
        .get(productmasters.getProductlist, productmasters.cookingProductlist, productmasters.getProductsBytitle);

    // Finish by binding the Productmaster middleware
    app.param('productmasterId', productmasters.productmasterByID);


    app.param('title', productmasters.productsBytitle);
};