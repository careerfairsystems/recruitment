'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Student name',
    trim: true
  },
  assignment: {
    type: String,
    default: '',
    required: 'Please fill Student assignment',
    trim: true
  },
  education: {
    type: String,
    default: '',
    required: 'Please fill Student education',
    trim: true
  },
  profile: {
    type: String,
    default: '',
    required: 'Please fill link to student profile',
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

mongoose.model('Student', StudentSchema);
