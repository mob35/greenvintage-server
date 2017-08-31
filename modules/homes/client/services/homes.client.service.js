// Homes service used to communicate Homes REST endpoints
(function () {
  'use strict';

  angular
    .module('homes')
    .factory('HomesService', HomesService);

  HomesService.$inject = ['$resource'];

  function HomesService($resource) {
    return $resource('api/homes/:homeId', {
      homeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
