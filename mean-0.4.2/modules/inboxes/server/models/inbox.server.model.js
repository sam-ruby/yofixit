'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Inbox Schema
 */
var InboxSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Inbox name',
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

mongoose.model('Inbox', InboxSchema);
