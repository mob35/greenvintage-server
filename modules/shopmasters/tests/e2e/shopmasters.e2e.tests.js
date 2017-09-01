'use strict';

describe('Shopmasters E2E Tests:', function () {
  describe('Test Shopmasters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/shopmasters');
      expect(element.all(by.repeater('shopmaster in shopmasters')).count()).toEqual(0);
    });
  });
});
