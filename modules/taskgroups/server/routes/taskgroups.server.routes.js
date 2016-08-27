'use strict';

/**
 * Module dependencies
 */
var taskgroupsPolicy = require('../policies/taskgroups.server.policy'),
  taskgroups = require('../controllers/taskgroups.server.controller');

module.exports = function(app) {
  // Taskgroups Routes
  app.route('/api/taskgroups').all(taskgroupsPolicy.isAllowed)
    .get(taskgroups.list)
    .post(taskgroups.create);

  app.route('/api/taskgroups/:taskgroupId').all(taskgroupsPolicy.isAllowed)
    .get(taskgroups.read)
    .put(taskgroups.update)
    .delete(taskgroups.delete);

  // Finish by binding the Taskgroup middleware
  app.param('taskgroupId', taskgroups.taskgroupByID);
};
