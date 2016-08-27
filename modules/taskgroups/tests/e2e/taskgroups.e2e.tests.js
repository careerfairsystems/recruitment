'use strict';

describe('Taskgroups E2E Tests:', function () {
  describe('Test Taskgroups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/taskgroups');
      expect(element.all(by.repeater('taskgroup in taskgroups')).count()).toEqual(0);
    });
  });
});
