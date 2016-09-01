'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Taskapplication = mongoose.model('Taskapplication'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, taskapplication;

/**
 * Taskapplication routes tests
 */
describe('Taskapplication CRUD tests', function () {

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

    // Save a user to the test db and create new Taskapplication
    user.save(function () {
      taskapplication = {
        name: 'Taskapplication name'
      };

      done();
    });
  });

  it('should be able to save a Taskapplication if logged in', function (done) {
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

        // Save a new Taskapplication
        agent.post('/api/taskapplications')
          .send(taskapplication)
          .expect(200)
          .end(function (taskapplicationSaveErr, taskapplicationSaveRes) {
            // Handle Taskapplication save error
            if (taskapplicationSaveErr) {
              return done(taskapplicationSaveErr);
            }

            // Get a list of Taskapplications
            agent.get('/api/taskapplications')
              .end(function (taskapplicationsGetErr, taskapplicationsGetRes) {
                // Handle Taskapplication save error
                if (taskapplicationsGetErr) {
                  return done(taskapplicationsGetErr);
                }

                // Get Taskapplications list
                var taskapplications = taskapplicationsGetRes.body;

                // Set assertions
                (taskapplications[0].user._id).should.equal(userId);
                (taskapplications[0].name).should.match('Taskapplication name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Taskapplication if not logged in', function (done) {
    agent.post('/api/taskapplications')
      .send(taskapplication)
      .expect(403)
      .end(function (taskapplicationSaveErr, taskapplicationSaveRes) {
        // Call the assertion callback
        done(taskapplicationSaveErr);
      });
  });

  it('should not be able to save an Taskapplication if no name is provided', function (done) {
    // Invalidate name field
    taskapplication.name = '';

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

        // Save a new Taskapplication
        agent.post('/api/taskapplications')
          .send(taskapplication)
          .expect(400)
          .end(function (taskapplicationSaveErr, taskapplicationSaveRes) {
            // Set message assertion
            (taskapplicationSaveRes.body.message).should.match('Please fill Taskapplication name');

            // Handle Taskapplication save error
            done(taskapplicationSaveErr);
          });
      });
  });

  it('should be able to update an Taskapplication if signed in', function (done) {
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

        // Save a new Taskapplication
        agent.post('/api/taskapplications')
          .send(taskapplication)
          .expect(200)
          .end(function (taskapplicationSaveErr, taskapplicationSaveRes) {
            // Handle Taskapplication save error
            if (taskapplicationSaveErr) {
              return done(taskapplicationSaveErr);
            }

            // Update Taskapplication name
            taskapplication.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Taskapplication
            agent.put('/api/taskapplications/' + taskapplicationSaveRes.body._id)
              .send(taskapplication)
              .expect(200)
              .end(function (taskapplicationUpdateErr, taskapplicationUpdateRes) {
                // Handle Taskapplication update error
                if (taskapplicationUpdateErr) {
                  return done(taskapplicationUpdateErr);
                }

                // Set assertions
                (taskapplicationUpdateRes.body._id).should.equal(taskapplicationSaveRes.body._id);
                (taskapplicationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Taskapplications if not signed in', function (done) {
    // Create new Taskapplication model instance
    var taskapplicationObj = new Taskapplication(taskapplication);

    // Save the taskapplication
    taskapplicationObj.save(function () {
      // Request Taskapplications
      request(app).get('/api/taskapplications')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Taskapplication if not signed in', function (done) {
    // Create new Taskapplication model instance
    var taskapplicationObj = new Taskapplication(taskapplication);

    // Save the Taskapplication
    taskapplicationObj.save(function () {
      request(app).get('/api/taskapplications/' + taskapplicationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', taskapplication.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Taskapplication with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/taskapplications/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Taskapplication is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Taskapplication which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Taskapplication
    request(app).get('/api/taskapplications/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Taskapplication with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Taskapplication if signed in', function (done) {
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

        // Save a new Taskapplication
        agent.post('/api/taskapplications')
          .send(taskapplication)
          .expect(200)
          .end(function (taskapplicationSaveErr, taskapplicationSaveRes) {
            // Handle Taskapplication save error
            if (taskapplicationSaveErr) {
              return done(taskapplicationSaveErr);
            }

            // Delete an existing Taskapplication
            agent.delete('/api/taskapplications/' + taskapplicationSaveRes.body._id)
              .send(taskapplication)
              .expect(200)
              .end(function (taskapplicationDeleteErr, taskapplicationDeleteRes) {
                // Handle taskapplication error error
                if (taskapplicationDeleteErr) {
                  return done(taskapplicationDeleteErr);
                }

                // Set assertions
                (taskapplicationDeleteRes.body._id).should.equal(taskapplicationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Taskapplication if not signed in', function (done) {
    // Set Taskapplication user
    taskapplication.user = user;

    // Create new Taskapplication model instance
    var taskapplicationObj = new Taskapplication(taskapplication);

    // Save the Taskapplication
    taskapplicationObj.save(function () {
      // Try deleting Taskapplication
      request(app).delete('/api/taskapplications/' + taskapplicationObj._id)
        .expect(403)
        .end(function (taskapplicationDeleteErr, taskapplicationDeleteRes) {
          // Set message assertion
          (taskapplicationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Taskapplication error error
          done(taskapplicationDeleteErr);
        });

    });
  });

  it('should be able to get a single Taskapplication that has an orphaned user reference', function (done) {
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

          // Save a new Taskapplication
          agent.post('/api/taskapplications')
            .send(taskapplication)
            .expect(200)
            .end(function (taskapplicationSaveErr, taskapplicationSaveRes) {
              // Handle Taskapplication save error
              if (taskapplicationSaveErr) {
                return done(taskapplicationSaveErr);
              }

              // Set assertions on new Taskapplication
              (taskapplicationSaveRes.body.name).should.equal(taskapplication.name);
              should.exist(taskapplicationSaveRes.body.user);
              should.equal(taskapplicationSaveRes.body.user._id, orphanId);

              // force the Taskapplication to have an orphaned user reference
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

                    // Get the Taskapplication
                    agent.get('/api/taskapplications/' + taskapplicationSaveRes.body._id)
                      .expect(200)
                      .end(function (taskapplicationInfoErr, taskapplicationInfoRes) {
                        // Handle Taskapplication error
                        if (taskapplicationInfoErr) {
                          return done(taskapplicationInfoErr);
                        }

                        // Set assertions
                        (taskapplicationInfoRes.body._id).should.equal(taskapplicationSaveRes.body._id);
                        (taskapplicationInfoRes.body.name).should.equal(taskapplication.name);
                        should.equal(taskapplicationInfoRes.body.user, undefined);

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
      Taskapplication.remove().exec(done);
    });
  });
});
