'use strict';

/**
 * Module dependencies
 */
var taskapplicationsPolicy = require('../policies/taskapplications.server.policy'),
  taskapplications = require('../controllers/taskapplications.server.controller');

module.exports = function(app) {
  // Taskapplications Routes
  app.route('/api/taskapplications').all(taskapplicationsPolicy.isAllowed)
    .get(taskapplications.list)
    .post(taskapplications.create);

  app.route('/api/taskapplications/:taskapplicationId').all(taskapplicationsPolicy.isAllowed)
    .get(taskapplications.read)
    .put(taskapplications.update)
    .delete(taskapplications.delete);

  // Finish by binding the Taskapplication middleware
  app.param('taskapplicationId', taskapplications.taskapplicationByID);
};
