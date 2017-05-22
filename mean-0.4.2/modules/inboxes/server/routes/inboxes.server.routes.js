'use strict';

/**
 * Module dependencies
 */
var inboxesPolicy = require('../policies/inboxes.server.policy'),
  inboxes = require('../controllers/inboxes.server.controller');

module.exports = function(app) {
  // Inboxes Routes
  app.route('/api/inboxes').all(inboxesPolicy.isAllowed)
    .get(inboxes.list)
    .post(inboxes.create);

  app.route('/api/inboxes/:inboxId').all(inboxesPolicy.isAllowed)
    .get(inboxes.read)
    .put(inboxes.update)
    .delete(inboxes.delete);

  // Finish by binding the Inbox middleware
  app.param('inboxId', inboxes.inboxByID);
};
