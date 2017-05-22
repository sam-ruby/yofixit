'use strict';

/**
 * Module dependencies
 */
var automotivesPolicy = require('../policies/automotives.server.policy'),
  automotives = require('../controllers/automotives.server.controller');

module.exports = function(app) {
  // Automotives Routes
  app.route('/api/automotives').all(automotivesPolicy.isAllowed)
    .get(automotives.list)
    .post(automotives.create);

  app.route('/api/automotives/:automotiveId').all(automotivesPolicy.isAllowed)
    .get(automotives.read)
    .put(automotives.update)
    .delete(automotives.delete);

  // Finish by binding the Automotive middleware
  app.param('automotiveId', automotives.automotiveByID);
};
