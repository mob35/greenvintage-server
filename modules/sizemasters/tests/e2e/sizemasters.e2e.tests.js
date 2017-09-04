'use strict';

describe('Sizemasters E2E Tests:', function () {
  describe('Test Sizemasters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sizemasters');
      expect(element.all(by.repeater('sizemaster in sizemasters')).count()).toEqual(0);
    });
  });
});
