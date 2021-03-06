'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Taskgroup Schema
 */
var TaskgroupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Taskgroup name',
    trim: true
  },
  engname: {
    type: String,
    default: '',
    required: 'Please fill the english Taskgroup name',
    trim: true
  },
  description: String,
  tasks: [ { name: String, quantity: Number, description: String } ],
  taskperiod: { start: Date, end: Date },
  applicationperiod: { start: Date, end: Date },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  active: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Taskgroup', TaskgroupSchema);
