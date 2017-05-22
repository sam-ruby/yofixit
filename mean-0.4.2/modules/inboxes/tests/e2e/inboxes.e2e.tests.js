'use strict';

describe('Inboxes E2E Tests:', function () {
  describe('Test Inboxes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/inboxes');
      expect(element.all(by.repeater('inbox in inboxes')).count()).toEqual(0);
    });
  });
});
