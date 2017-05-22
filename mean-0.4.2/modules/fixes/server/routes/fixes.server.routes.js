'use strict';

/**
 * Module dependencies
 */
var fixesPolicy = require('../policies/fixes.server.policy'),
  fixes = require('../controllers/fixes.server.controller');

module.exports = function(app) {
  // Fixes Routes
  app.route('/api/fixes').all(fixesPolicy.isAllowed)
    .get(fixes.list)
    .post(fixes.create);

  app.route('/api/fixes/:fixId').all(fixesPolicy.isAllowed)
    .get(fixes.read)
    .put(fixes.update)
    .delete(fixes.delete);

  // Finish by binding the Fix middleware
  app.param('fixId', fixes.fixByID);
};
