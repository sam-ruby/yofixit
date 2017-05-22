'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Fix = mongoose.model('Fix'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Fix
 */
exports.create = function(req, res) {
  var fix = new Fix(req.body);
  fix.user = req.user;

  fix.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fix);
    }
  });
};

/**
 * Show the current Fix
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var fix = req.fix ? req.fix.toJSON() : {};
  console.log('Fix is ', fix);

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  fix.isCurrentUserOwner = req.user && fix.user && fix.user._id.toString() === req.user._id.toString();

  res.jsonp(fix);
};

/**
 * Update a Fix
 */
exports.update = function(req, res) {
  var fix = req.fix;

  fix = _.extend(fix, req.body);

  fix.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fix);
    }
  });
};

/**
 * Delete an Fix
 */
exports.delete = function(req, res) {
  var fix = req.fix;

  fix.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fix);
    }
  });
};

/**
 * List of Fixes
 */
exports.list = function(req, res) {
  Fix.find().sort('-created').populate('user', 'displayName').exec(function(err, fixes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fixes);
    }
  });
};

/**
 * Fix middleware
 */
exports.fixByID = function(req, res, next, id) {
  // Hack to return a hard coded Fix.

  req.fix = new Fix({ name: 'European Auto Performance' });
  return next();
  /*
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Fix is invalid'
    });
  }

  Fix.findById(id).populate('user', 'displayName').exec(function (err, fix) {
    if (err) {
      return next(err);
    } else if (!fix) {
      return res.status(404).send({
        message: 'No Fix with that identifier has been found'
      });
    }
    req.fix = fix;
    next();
  });
  */
};
