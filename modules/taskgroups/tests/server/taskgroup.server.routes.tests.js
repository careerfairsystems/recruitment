'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Taskgroup = mongoose.model('Taskgroup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, taskgroup;

/**
 * Taskgroup routes tests
 */
describe('Taskgroup CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Taskgroup
    user.save(function () {
      taskgroup = {
        name: 'Taskgroup name'
      };

      done();
    });
  });

  it('should be able to save a Taskgroup if admin', function (done) {
    user.roles = ['user', 'admin'];
    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Taskgroup
        agent.post('/api/taskgroups')
        .send(taskgroup)
        .expect(200)
        .end(function (taskgroupSaveErr, taskgroupSaveRes) {
          // Handle Taskgroup save error
          if (taskgroupSaveErr) {
            return done(taskgroupSaveErr);
          }

          // Get a list of Taskgroups
          agent.get('/api/taskgroups')
          .end(function (taskgroupsGetErr, taskgroupsGetRes) {
            // Handle Taskgroup save error
            if (taskgroupsGetErr) {
              return done(taskgroupsGetErr);
            }

            // Get Taskgroups list
            var taskgroups = taskgroupsGetRes.body;

            // Set assertions
            (taskgroups[0].user._id).should.equal(userId);
            (taskgroups[0].name).should.match('Taskgroup name');

            // Call the assertion callback
            done();
          });
        });
      });
    });
  });
  it('should not be able to save a Taskgroup if not admin', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Taskgroup
        agent.post('/api/taskgroups')
          .send(taskgroup)
          .expect(403)
          .end(function (taskgroupSaveErr, taskgroupSaveRes) {
            // Handle Taskgroup save error
            if (taskgroupSaveErr) {
              return done(taskgroupSaveErr);
            }
            return done();
          });
      });
  });

  it('should not be able to save an Taskgroup if not logged in', function (done) {
    agent.post('/api/taskgroups')
      .send(taskgroup)
      .expect(403)
      .end(function (taskgroupSaveErr, taskgroupSaveRes) {
        // Call the assertion callback
        done(taskgroupSaveErr);
      });
  });

  it('should not be able to save an Taskgroup if no name is provided', function (done) {
    // Invalidate name field
    taskgroup.name = '';

    user.roles = ['user', 'admin'];
    user.save(function (err) {
      agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Taskgroup
        agent.post('/api/taskgroups')
        .send(taskgroup)
        .expect(400)
        .end(function (taskgroupSaveErr, taskgroupSaveRes) {
          // Set message assertion
          (taskgroupSaveRes.body.message).should.match('Please fill Taskgroup name');

          // Handle Taskgroup save error
          done(taskgroupSaveErr);
        });
      });
    });
  });

  it('should be able to update an Taskgroup if signed in', function (done) {
    user.roles = ['user', 'admin'];
    user.save(function (err) {
      agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Taskgroup
        agent.post('/api/taskgroups')
        .send(taskgroup)
        .expect(200)
        .end(function (taskgroupSaveErr, taskgroupSaveRes) {
          // Handle Taskgroup save error
          if (taskgroupSaveErr) {
            return done(taskgroupSaveErr);
          }

          // Update Taskgroup name
          taskgroup.name = 'WHY YOU GOTTA BE SO MEAN?';

          // Update an existing Taskgroup
          agent.put('/api/taskgroups/' + taskgroupSaveRes.body._id)
          .send(taskgroup)
          .expect(200)
          .end(function (taskgroupUpdateErr, taskgroupUpdateRes) {
            // Handle Taskgroup update error
            if (taskgroupUpdateErr) {
              return done(taskgroupUpdateErr);
            }

            // Set assertions
            (taskgroupUpdateRes.body._id).should.equal(taskgroupSaveRes.body._id);
            (taskgroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

            // Call the assertion callback
            done();
          });
        });
      });
    });
  });

  it('should be able to get a list of Taskgroups if not signed in', function (done) {
    // Create new Taskgroup model instance
    var taskgroupObj = new Taskgroup(taskgroup);

    // Save the taskgroup
    taskgroupObj.save(function () {
      // Request Taskgroups
      request(app).get('/api/taskgroups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Taskgroup if not signed in', function (done) {
    // Create new Taskgroup model instance
    var taskgroupObj = new Taskgroup(taskgroup);

    // Save the Taskgroup
    taskgroupObj.save(function () {
      request(app).get('/api/taskgroups/' + taskgroupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', taskgroup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Taskgroup with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/taskgroups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Taskgroup is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Taskgroup which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Taskgroup
    request(app).get('/api/taskgroups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Taskgroup with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Taskgroup if signed in as admin', function (done) {
    user.roles = ['user', 'admin'];
    user.save(function (err) {
      agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Taskgroup
        agent.post('/api/taskgroups')
        .send(taskgroup)
        .expect(200)
        .end(function (taskgroupSaveErr, taskgroupSaveRes) {
          // Handle Taskgroup save error
          if (taskgroupSaveErr) {
            return done(taskgroupSaveErr);
          }

          // Delete an existing Taskgroup
          agent.delete('/api/taskgroups/' + taskgroupSaveRes.body._id)
          .send(taskgroup)
          .expect(200)
          .end(function (taskgroupDeleteErr, taskgroupDeleteRes) {
            // Handle taskgroup error error
            if (taskgroupDeleteErr) {
              return done(taskgroupDeleteErr);
            }

            // Set assertions
            (taskgroupDeleteRes.body._id).should.equal(taskgroupSaveRes.body._id);

            // Call the assertion callback
            done();
          });
        });
      });
    });
  });

  it('should not be able to delete an Taskgroup if not signed in', function (done) {
    // Set Taskgroup user
    taskgroup.user = user;

    // Create new Taskgroup model instance
    var taskgroupObj = new Taskgroup(taskgroup);

    // Save the Taskgroup
    taskgroupObj.save(function () {
      // Try deleting Taskgroup
      request(app).delete('/api/taskgroups/' + taskgroupObj._id)
        .expect(403)
        .end(function (taskgroupDeleteErr, taskgroupDeleteRes) {
          // Set message assertion
          (taskgroupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Taskgroup error error
          done(taskgroupDeleteErr);
        });

    });
  });

  it('should be able to get a single Taskgroup that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      roles: ['user', 'admin'],
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Taskgroup
          agent.post('/api/taskgroups')
            .send(taskgroup)
            .expect(200)
            .end(function (taskgroupSaveErr, taskgroupSaveRes) {
              // Handle Taskgroup save error
              if (taskgroupSaveErr) {
                return done(taskgroupSaveErr);
              }

              // Set assertions on new Taskgroup
              (taskgroupSaveRes.body.name).should.equal(taskgroup.name);
              should.exist(taskgroupSaveRes.body.user);
              should.equal(taskgroupSaveRes.body.user._id, orphanId);

              // force the Taskgroup to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Taskgroup
                    agent.get('/api/taskgroups/' + taskgroupSaveRes.body._id)
                      .expect(200)
                      .end(function (taskgroupInfoErr, taskgroupInfoRes) {
                        // Handle Taskgroup error
                        if (taskgroupInfoErr) {
                          return done(taskgroupInfoErr);
                        }

                        // Set assertions
                        (taskgroupInfoRes.body._id).should.equal(taskgroupSaveRes.body._id);
                        (taskgroupInfoRes.body.name).should.equal(taskgroup.name);
                        should.equal(taskgroupInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Taskgroup.remove().exec(done);
    });
  });
});
