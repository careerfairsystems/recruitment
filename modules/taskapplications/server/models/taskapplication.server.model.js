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
    required: 'Please fill the applicants name',
    trim: true
  },
  program: {
    type: String,
    default: '',
    required: 'Please fill the applicants program',
    trim: true
  },
  year: {
    type: String,
    default: 1,
    required: 'Please fill the applicants year'
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill the applicants email',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    required: 'Please fill the applicants phone',
    trim: true
  },
  tshirtsize: {
    type: String,
    default: '',
    required: 'Please fill the applicants tshirtsize',
    trim: true
  },
  foodpref: {
    type: String,
    default: '',
    trim: true
  },
  motivation: {
    type: String,
    default: '',
    required: 'Please fill the applicants motivation',
    trim: true
  },
  choices: [{ order: Number, choice: String }],
  internationalStudent: {
    type: Boolean,
    default: false,
    required: 'Please fill if the applicant is a international student'
  }, 
  driverLicense: {
    type: Boolean,
    default: false,
    required: 'Please fill if the applicant has a driver license'
  }, 
  attendGasque: {
    type: Boolean,
    default: false,
    required: 'Please fill if the applicant can attend the gasque'
  }, 
  attendKickoff: {
    type: Boolean,
    default: false,
    required: 'Please fill if the applicant can attend the host kickoff'
  }, 
  assignedCompany: {
    type: String
  },
  chosenCompanies: [{
    name: String,
    order: Number
  }],
  assignedTask: {
    type: String,
    default: '',
    trim: true
  },
  point: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  taskgroup: {
    type: Schema.ObjectId,
    ref: 'Taskgroup'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

TaskapplicationSchema.index({taskgroup:1, user:1},{unique:true});

mongoose.model('Taskapplication', TaskapplicationSchema);
