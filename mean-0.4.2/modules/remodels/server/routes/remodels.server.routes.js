'use strict';

/**
 * Module dependencies
 */
var remodelsPolicy = require('../policies/remodels.server.policy'),
  remodels = require('../controllers/remodels.server.controller');

module.exports = function(app) {
  // Remodels Routes
  app.route('/api/remodels').all(remodelsPolicy.isAllowed)
    .get(remodels.list)
    .post(remodels.create);

  app.route('/api/remodels/:remodelId').all(remodelsPolicy.isAllowed)
    .get(remodels.read)
    .put(remodels.update)
    .delete(remodels.delete);

  // Finish by binding the Remodel middleware
  app.param('remodelId', remodels.remodelByID);
};
