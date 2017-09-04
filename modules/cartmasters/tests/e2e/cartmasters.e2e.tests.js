'use strict';

describe('Cartmasters E2E Tests:', function () {
  describe('Test Cartmasters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cartmasters');
      expect(element.all(by.repeater('cartmaster in cartmasters')).count()).toEqual(0);
    });
  });
});
