'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Taskapplication Schema
 */
var TaskapplicationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Taskapplication name',
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

mongoose.model('Taskapplication', TaskapplicationSchema);
