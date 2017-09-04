// Ordermasters service used to communicate Ordermasters REST endpoints
(function () {
  'use strict';

  angular
    .module('ordermasters')
    .factory('OrdermastersService', OrdermastersService);

  OrdermastersService.$inject = ['$resource'];

  function OrdermastersService($resource) {
    return $resource('api/ordermasters/:ordermasterId', {
      ordermasterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
