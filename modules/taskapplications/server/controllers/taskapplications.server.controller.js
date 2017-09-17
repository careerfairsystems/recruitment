'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  config = require(path.resolve('./config/config')),
  Taskapplication = mongoose.model('Taskapplication'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  _ = require('lodash');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Create a Taskapplication
 */
exports.create = function(req, res) {
  //var user = req.param.userId
  //var taskapplication = Taskapplication.find({user: user});
  //if(!taskapplication) { 
    console.log(req.body);
    console.log("user: " + req.body.user);
    console.log("taskground: " + req.body.taskgroup);
    Taskapplication.findOne({taskgroup:req.body.taskgroup, user:req.body.user}, function(err, app) {
	if(err) {
	    console.log("Error while finding app");
      	    return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
	    });
	} else {
	    var taskapplication = app;
	    console.log(app);
    	    if(taskapplication) {
		taskapplication = _.extend(taskapplication, req.body);
            } else {
		taskapplication = new Taskapplication(req.body);
            }
	
  	    taskapplication.save(function(err) {
    	        if (err) {
		    console.log("Error while saving");
      		    return res.status(400).send({
        	        message: errorHandler.getErrorMessage(err)
      		    });
                } else {
      		    res.jsonp(taskapplication);
                }
  	    });
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
  taskapplication.isCurrentUserOwner = (req.user && taskapplication.user && taskapplication.user._id.toString() === req.user._id.toString()) ? true : false;

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
 * Send confirmation mail to applicant (POST)
 */
exports.confirmationMail = function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  async.waterfall([
    function (done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render(path.resolve('modules/taskapplications/server/templates/mailconfirmation'), {
        name: name,
        appName: config.app.title,
      }, function (err, emailHTML) {
        done(err, emailHTML);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, done) {
      var mailOptions = {
        to: email,
        from: config.mailer.from,
        subject: 'Bekräftelse Värdansökan / Confirmation host application',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email: ' + err
          });
        }
        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
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
