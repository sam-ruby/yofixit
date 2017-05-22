'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Inbox = mongoose.model('Inbox'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Inbox
 */
exports.create = function(req, res) {
  var inbox = new Inbox(req.body);
  inbox.user = req.user;

  inbox.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inbox);
    }
  });
};

/**
 * Show the current Inbox
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var inbox = req.inbox ? req.inbox.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  inbox.isCurrentUserOwner = req.user && inbox.user && inbox.user._id.toString() === req.user._id.toString();

  res.jsonp(inbox);
};

/**
 * Update a Inbox
 */
exports.update = function(req, res) {
  var inbox = req.inbox;

  inbox = _.extend(inbox, req.body);

  inbox.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inbox);
    }
  });
};

/**
 * Delete an Inbox
 */
exports.delete = function(req, res) {
  var inbox = req.inbox;

  inbox.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inbox);
    }
  });
};

/**
 * List of Inboxes
 */
exports.list = function(req, res) {
  Inbox.find().sort('-created').populate('user', 'displayName').exec(function(err, inboxes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inboxes);
    }
  });
};

/**
 * Inbox middleware
 */
exports.inboxByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Inbox is invalid'
    });
  }

  Inbox.findById(id).populate('user', 'displayName').exec(function (err, inbox) {
    if (err) {
      return next(err);
    } else if (!inbox) {
      return res.status(404).send({
        message: 'No Inbox with that identifier has been found'
      });
    }
    req.inbox = inbox;
    next();
  });
};
