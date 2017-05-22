'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Remodel Schema
 */
var RemodelSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Remodel name',
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

mongoose.model('Remodel', RemodelSchema);
