// Shopmasters service used to communicate Shopmasters REST endpoints
(function () {
  'use strict';

  angular
    .module('shopmasters')
    .factory('ShopmastersService', ShopmastersService);

  ShopmastersService.$inject = ['$resource'];

  function ShopmastersService($resource) {
    return $resource('api/shopmasters/:shopmasterId', {
      shopmasterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
