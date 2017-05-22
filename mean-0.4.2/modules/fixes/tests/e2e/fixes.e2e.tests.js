'use strict';

describe('Fixes E2E Tests:', function () {
  describe('Test Fixes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/fixes');
      expect(element.all(by.repeater('fix in fixes')).count()).toEqual(0);
    });
  });
});
