'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Automotive Schema
 */
var AutomotiveSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Automotive name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Automotive', AutomotiveSchema);
