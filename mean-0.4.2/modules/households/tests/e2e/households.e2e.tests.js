'use strict';

describe('Households E2E Tests:', function () {
  describe('Test Households page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/households');
      expect(element.all(by.repeater('household in households')).count()).toEqual(0);
    });
  });
});
