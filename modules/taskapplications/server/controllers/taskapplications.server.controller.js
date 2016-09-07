'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Taskapplication = mongoose.model('Taskapplication'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Taskapplication
 */
exports.create = function(req, res) {
  var taskapplication = new Taskapplication(req.body);
  taskapplication.user = req.user;

  taskapplication.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskapplication);
    }
  });
};

/**
 * Show the current Taskapplication
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var taskapplication = req.taskapplication ? req.taskapplication.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  taskapplication.isCurrentUserOwner = req.user && taskapplication.user && taskapplication.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(taskapplication);
};

/**
 * Update a Taskapplication
 */
exports.update = function(req, res) {
  var taskapplication = req.taskapplication ;

  taskapplication = _.extend(taskapplication , req.body);

  taskapplication.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskapplication);
    }
  });
};

/**
 * Delete an Taskapplication
 */
exports.delete = function(req, res) {
  var taskapplication = req.taskapplication ;

  taskapplication.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskapplication);
    }
  });
};

/**
 * List of the users Taskapplications
 */
exports.mylist = function(req, res) { 
  var req_user = req.params.userId;
  Taskapplication.find({ user: req_user }).sort('-created').populate('user', 'displayName').exec(function(err, taskapplications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskapplications);
    }
  });
};
/**
 * List of Taskapplications
 */
exports.list = function(req, res) { 
  Taskapplication.find().sort('-created').populate('user', 'displayName').exec(function(err, taskapplications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taskapplications);
    }
  });
};

/**
 * Taskapplication middleware
 */
exports.taskapplicationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Taskapplication is invalid'
    });
  }

  Taskapplication.findById(id).populate('user', 'displayName').exec(function (err, taskapplication) {
    if (err) {
      return next(err);
    } else if (!taskapplication) {
      return res.status(404).send({
        message: 'No Taskapplication with that identifier has been found'
      });
    }
    req.taskapplication = taskapplication;
    next();
  });
};
