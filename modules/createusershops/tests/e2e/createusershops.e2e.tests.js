'use strict';

describe('Createusershops E2E Tests:', function () {
  describe('Test Createusershops page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/createusershops');
      expect(element.all(by.repeater('createusershop in createusershops')).count()).toEqual(0);
    });
  });
});
