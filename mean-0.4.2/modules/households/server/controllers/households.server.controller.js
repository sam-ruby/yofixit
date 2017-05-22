'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Household = mongoose.model('Household'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Household
 */
exports.create = function(req, res) {
  var household = new Household(req.body);
  household.user = req.user;

  household.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(household);
    }
  });
};

/**
 * Show the current Household
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var household = req.household ? req.household.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  household.isCurrentUserOwner = req.user && household.user && household.user._id.toString() === req.user._id.toString();

  res.jsonp(household);
};

/**
 * Update a Household
 */
exports.update = function(req, res) {
  var household = req.household;

  household = _.extend(household, req.body);

  household.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(household);
    }
  });
};

/**
 * Delete an Household
 */
exports.delete = function(req, res) {
  var household = req.household;

  household.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(household);
    }
  });
};

/**
 * List of Households
 */
exports.list = function(req, res) {
  Household.find().sort('-created').populate('user', 'displayName').exec(function(err, households) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(households);
    }
  });
};

/**
 * Household middleware
 */
exports.householdByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Household is invalid'
    });
  }

  Household.findById(id).populate('user', 'displayName').exec(function (err, household) {
    if (err) {
      return next(err);
    } else if (!household) {
      return res.status(404).send({
        message: 'No Household with that identifier has been found'
      });
    }
    req.household = household;
    next();
  });
};
