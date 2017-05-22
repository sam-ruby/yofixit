'use strict';

describe('Automotives E2E Tests:', function () {
  describe('Test Automotives page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/automotives');
      expect(element.all(by.repeater('automotive in automotives')).count()).toEqual(0);
    });
  });
});
