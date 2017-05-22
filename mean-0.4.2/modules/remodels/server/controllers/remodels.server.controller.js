'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Remodel = mongoose.model('Remodel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Remodel
 */
exports.create = function(req, res) {
  var remodel = new Remodel(req.body);
  remodel.user = req.user;

  remodel.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(remodel);
    }
  });
};

/**
 * Show the current Remodel
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var remodel = req.remodel ? req.remodel.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  remodel.isCurrentUserOwner = req.user && remodel.user && remodel.user._id.toString() === req.user._id.toString();

  res.jsonp(remodel);
};

/**
 * Update a Remodel
 */
exports.update = function(req, res) {
  var remodel = req.remodel;

  remodel = _.extend(remodel, req.body);

  remodel.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(remodel);
    }
  });
};

/**
 * Delete an Remodel
 */
exports.delete = function(req, res) {
  var remodel = req.remodel;

  remodel.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(remodel);
    }
  });
};

/**
 * List of Remodels
 */
exports.list = function(req, res) {
  Remodel.find().sort('-created').populate('user', 'displayName').exec(function(err, remodels) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(remodels);
    }
  });
};

/**
 * Remodel middleware
 */
exports.remodelByID = function(req, res, next, id) {

  req.remodel = new Remodel({ name: 'PAB Construction' });
  return next();

  /*
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Remodel is invalid'
    });
  }

  Remodel.findById(id).populate('user', 'displayName').exec(function (err, remodel) {
    if (err) {
      return next(err);
    } else if (!remodel) {
      return res.status(404).send({
        message: 'No Remodel with that identifier has been found'
      });
    }
    req.remodel = remodel;
    next();
  });
  */
};
