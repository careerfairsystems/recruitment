'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Taskgroups Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/taskgroups',
      permissions: '*'
    }, {
      resources: '/api/taskgroups/:taskgroupId',
      permissions: '*'
    }, {
      resources: '/api/taskgroups/active',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/taskgroups',
      permissions: ['get']
    }, {
      resources: '/api/taskgroups/:taskgroupId',
      permissions: ['get']
    }, {
      resources: '/api/taskgroups/active',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/taskgroups',
      permissions: ['get']
    }, {
      resources: '/api/taskgroups/:taskgroupId',
      permissions: ['get']
    }, {
      resources: '/api/taskgroups/active',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Taskgroups Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Taskgroup is being processed and the current user created it then allow any manipulation
  if (req.taskgroup && req.user && req.taskgroup.user && req.taskgroup.user.id === req.user.id) {
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
