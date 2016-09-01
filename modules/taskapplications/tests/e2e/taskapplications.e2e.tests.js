'use strict';

describe('Taskapplications E2E Tests:', function () {
  describe('Test Taskapplications page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/taskapplications');
      expect(element.all(by.repeater('taskapplication in taskapplications')).count()).toEqual(0);
    });
  });
});
