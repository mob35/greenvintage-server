'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Carts Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/carts/add',
      permissions: '*'
    },
    {
      resources: '/api/carts/remove',
      permissions: '*'
    },
    {
      resources: '/api/carts/delete',
      permissions: '*'
    },
    {
      resources: '/api/carts/get-by-user',
      permissions: '*'
    }
    ]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/carts/add',
      permissions: ['get', 'post']
    },
    {
      resources: '/api/carts/remove',
      permissions: ['post']
    },
    {
      resources: '/api/carts/delete',
      permissions: ['post']
    },
    {
      resources: '/api/carts/get-by-user',
      permissions: ['get']
    }
    ]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/carts/add',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Carts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Cart is being processed and the current user created it then allow any manipulation
  if (req.cart && req.user && req.cart.user && req.cart.user.id === req.user.id) {
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
