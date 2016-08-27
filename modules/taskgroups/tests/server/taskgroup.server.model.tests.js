'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Taskgroup = mongoose.model('Taskgroup');

/**
 * Globals
 */
var user, taskgroup;

/**
 * Unit tests
 */
describe('Taskgroup Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      taskgroup = new Taskgroup({
        name: 'Taskgroup Name',
        description: 'My description',
        tasks: [{ name: 'it', quantity: 2, description: 'IT e nice' }],
        taskperiod: { start: Date.now(), end: Date.now() },
        applicationperiod: { start: Date.now(), end: Date.now() },
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return taskgroup.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      taskgroup.name = '';

      return taskgroup.save(function(err) {
        should.exist(err);
        done();
      });
    });
    it('should save all correct values', function(done) {
      taskgroup.save(function(err, tg) {
        should.not.exist(err);
        should.exist(tg);
        tg.description.should.equal('My description');
        tg.tasks[0].name.should.equal('it');
        tg.taskperiod.should.have.property('start');
        tg.taskperiod.should.have.property('end');
        tg.applicationperiod.should.have.property('start');
        tg.applicationperiod.should.have.property('end');
        done();
      });
    });
  });

  afterEach(function(done) { 
    Taskgroup.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
