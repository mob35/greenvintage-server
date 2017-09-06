'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Homes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/homes',
      permissions: '*'
    }, {
      resources: '/api/homes/:homeId',
      permissions: '*'
    }, {
      resources: '/api/getproucttop/:keyword',
      permissions: ['get']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/homes',
      permissions: ['get', 'post']
    }, {
      resources: '/api/homes/:homeId',
      permissions: ['get']
    }, {
      resources: '/api/getproucttop/:keyword',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/homes',
      permissions: ['get']
    }, {
      resources: '/api/homes/:homeId',
      permissions: ['get']
    }, {
      resources: '/api/getproucttop/:keyword',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Homes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Home is being processed and the current user created it then allow any manipulation
  if (req.home && req.user && req.home.user && req.home.user.id === req.user.id) {
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
