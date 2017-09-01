// Categorymasters service used to communicate Categorymasters REST endpoints
(function () {
  'use strict';

  angular
    .module('categorymasters')
    .factory('CategorymastersService', CategorymastersService);

  CategorymastersService.$inject = ['$resource'];

  function CategorymastersService($resource) {
    return $resource('api/categorymasters/:categorymasterId', {
      categorymasterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
