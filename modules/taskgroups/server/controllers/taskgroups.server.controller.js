'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Taskgroup = mongoose.model('Taskgroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Taskgroup
 */
exports.create = function(req, res) {
  var taskgroup = new Taskgroup(req.body);
  taskgroup.user = req.user;

  taskgroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskgroup);
    }
  });
};

/**
 * Show the current Taskgroup
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var taskgroup = req.taskgroup ? req.taskgroup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  taskgroup.isCurrentUserOwner = req.user && taskgroup.user && taskgroup.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(taskgroup);
};

/**
 * Update a Taskgroup
 */
exports.update = function(req, res) {
  var taskgroup = req.taskgroup ;

  taskgroup = _.extend(taskgroup , req.body);

  taskgroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskgroup);
    }
  });
};

/**
 * Delete an Taskgroup
 */
exports.delete = function(req, res) {
  var taskgroup = req.taskgroup ;

  taskgroup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskgroup);
    }
  });
};

/**
 * List of Taskgroups
 */
exports.list = function(req, res) { 
  Taskgroup.find().sort('-created').populate('user', 'displayName').exec(function(err, taskgroups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskgroups);
    }
  });
};

/**
 * Taskgroup middleware
 */
exports.taskgroupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Taskgroup is invalid'
    });
  }

  Taskgroup.findById(id).populate('user', 'displayName').exec(function (err, taskgroup) {
    if (err) {
      return next(err);
    } else if (!taskgroup) {
      return res.status(404).send({
        message: 'No Taskgroup with that identifier has been found'
      });
    }
    req.taskgroup = taskgroup;
    next();
  });
};
