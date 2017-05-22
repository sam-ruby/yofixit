'use strict';

describe('Remodels E2E Tests:', function () {
  describe('Test Remodels page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/remodels');
      expect(element.all(by.repeater('remodel in remodels')).count()).toEqual(0);
    });
  });
});
