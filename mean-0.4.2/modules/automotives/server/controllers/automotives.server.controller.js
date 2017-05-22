'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Automotive = mongoose.model('Automotive'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Automotive
 */
exports.create = function(req, res) {
  var automotive = new Automotive(req.body);
  automotive.user = req.user;

  automotive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(automotive);
    }
  });
};

/**
 * Show the current Automotive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var automotive = req.automotive ? req.automotive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  automotive.isCurrentUserOwner = req.user && automotive.user && automotive.user._id.toString() === req.user._id.toString();

  res.jsonp(automotive);
};

/**
 * Update a Automotive
 */
exports.update = function(req, res) {
  var automotive = req.automotive;

  automotive = _.extend(automotive, req.body);

  automotive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(automotive);
    }
  });
};

/**
 * Delete an Automotive
 */
exports.delete = function(req, res) {
  var automotive = req.automotive;

  automotive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(automotive);
    }
  });
};

/**
 * List of Automotives
 */
exports.list = function(req, res) {
  Automotive.find().sort('-created').populate('user', 'displayName').exec(function(err, automotives) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(automotives);
    }
  });
};

/**
 * Automotive middleware
 */
exports.automotiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Automotive is invalid'
    });
  }

  Automotive.findById(id).populate('user', 'displayName').exec(function (err, automotive) {
    if (err) {
      return next(err);
    } else if (!automotive) {
      return res.status(404).send({
        message: 'No Automotive with that identifier has been found'
      });
    }
    req.automotive = automotive;
    next();
  });
};
