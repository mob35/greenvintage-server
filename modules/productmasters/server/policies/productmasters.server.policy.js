'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Productmasters Permissions
 */
exports.invokeRolesPolicies = function() {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/productmasters',
            permissions: '*'
        }, {
            resources: '/api/productmasters/:productmasterId',
            permissions: '*'
        }, {
            resources: '/api/productlistbytitle/:title',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/productmasters',
            permissions: ['get', 'post']
        }, {
            resources: '/api/productmasters/:productmasterId',
            permissions: ['get']
        }, {
            resources: '/api/productlistbytitle/:title',
            permissions: ['get']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/productmasters',
            permissions: ['get']
        }, {
            resources: '/api/productmasters/:productmasterId',
            permissions: ['get']
        }, {
            resources: '/api/productlistbytitle/:title',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Productmasters Policy Allows
 */
exports.isAllowed = function(req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Productmaster is being processed and the current user created it then allow any manipulation
    if (req.productmaster && req.user && req.productmaster.user && req.productmaster.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
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