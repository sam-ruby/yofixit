'use strict';

/**
 * Module dependencies
 */
var householdsPolicy = require('../policies/households.server.policy'),
  households = require('../controllers/households.server.controller');

module.exports = function(app) {
  // Households Routes
  app.route('/api/households').all(householdsPolicy.isAllowed)
    .get(households.list)
    .post(households.create);

  app.route('/api/households/:householdId').all(householdsPolicy.isAllowed)
    .get(households.read)
    .put(households.update)
    .delete(households.delete);

  // Finish by binding the Household middleware
  app.param('householdId', households.householdByID);
};
