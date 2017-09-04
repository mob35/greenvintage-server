// Sizemasters service used to communicate Sizemasters REST endpoints
(function () {
  'use strict';

  angular
    .module('sizemasters')
    .factory('SizemastersService', SizemastersService);

  SizemastersService.$inject = ['$resource'];

  function SizemastersService($resource) {
    return $resource('api/sizemasters/:sizemasterId', {
      sizemasterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
