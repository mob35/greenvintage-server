'use strict';

describe('Productmasters E2E Tests:', function () {
  describe('Test Productmasters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/productmasters');
      expect(element.all(by.repeater('productmaster in productmasters')).count()).toEqual(0);
    });
  });
});
