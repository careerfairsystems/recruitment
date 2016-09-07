'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Taskapplications Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/taskapplications',
      permissions: '*'
    }, {
      resources: '/api/taskapplications/:taskapplicationId',
      permissions: '*'
    }, {
      resources: '/api/taskapplications/mylist/:userId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/taskapplications',
      permissions: ['get', 'post']
    }, {
      resources: '/api/taskapplications/:taskapplicationId',
      permissions: ['get']
    }, {
      resources: '/api/taskapplications/mylist/:userId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/taskapplications',
      permissions: ['get']
    }, {
      resources: '/api/taskapplications/:taskapplicationId',
      permissions: ['get']
    }, {
      resources: '/api/taskapplications/mylist/:userId',
      permissions: ['']
    }]
  }]);
};

/**
 * Check If Taskapplications Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Taskapplication is being processed and the current user created it then allow any manipulation
  if (req.taskapplication && req.user && req.taskapplication.user && req.taskapplication.user.id === req.user.id) {
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
