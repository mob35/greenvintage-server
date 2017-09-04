// Cartmasters service used to communicate Cartmasters REST endpoints
(function () {
  'use strict';

  angular
    .module('cartmasters')
    .factory('CartmastersService', CartmastersService);

  CartmastersService.$inject = ['$resource'];

  function CartmastersService($resource) {
    return $resource('api/cartmasters/:cartmasterId', {
      cartmasterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
