'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Orders Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/ordersbyshop',
      permissions: '*'
    }, {
      resources: '/api/orders/:orderId/:itemId',
      permissions: '*'
    }, {
      resources: '/api/orderlistbyshops',
      permissions: ['get']
    }, {
      resources: '/api/order',
      permissions: ['post']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/ordersbyshop',
      permissions: ['get']
    }, {
      resources: '/api/orders/:orderId/:itemId',
      permissions: '*'
    }, {
      resources: '/api/orderlistbyshops',
      permissions: ['get']
    }, {
      resources: '/api/order',
      permissions: ['post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/ordersbyshop',
      permissions: ['get']
    }, {
      resources: '/api/orders/:orderId/:itemId',
      permissions: ['get']
    }, {
      resources: '/api/orderlistbyshops',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Orders Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Order is being processed and the current user created it then allow any manipulation
  if (req.order && req.user && req.order.user && req.order.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
