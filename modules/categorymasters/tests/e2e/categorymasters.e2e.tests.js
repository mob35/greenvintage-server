'use strict';

describe('Categorymasters E2E Tests:', function () {
  describe('Test Categorymasters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/categorymasters');
      expect(element.all(by.repeater('categorymaster in categorymasters')).count()).toEqual(0);
    });
  });
});
