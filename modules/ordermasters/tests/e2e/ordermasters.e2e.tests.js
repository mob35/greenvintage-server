'use strict';

describe('Ordermasters E2E Tests:', function () {
  describe('Test Ordermasters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ordermasters');
      expect(element.all(by.repeater('ordermaster in ordermasters')).count()).toEqual(0);
    });
  });
});
