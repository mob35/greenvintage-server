// Productmasters service used to communicate Productmasters REST endpoints
(function () {
  'use strict';

  angular
    .module('productmasters')
    .factory('ProductmastersService', ProductmastersService);

  ProductmastersService.$inject = ['$resource'];

  function ProductmastersService($resource) {
    return $resource('api/productmasters/:productmasterId', {
      productmasterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
