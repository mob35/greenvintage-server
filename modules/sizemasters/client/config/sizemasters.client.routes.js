(function () {
  'use strict';

  angular
    .module('sizemasters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sizemasters', {
        abstract: true,
        url: '/sizemasters',
        template: '<ui-view/>'
      })
      .state('sizemasters.list', {
        url: '',
        templateUrl: 'modules/sizemasters/client/views/list-sizemasters.client.view.html',
        controller: 'SizemastersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sizemasters List'
        }
      })
      .state('sizemasters.create', {
        url: '/create',
        templateUrl: 'modules/sizemasters/client/views/form-sizemaster.client.view.html',
        controller: 'SizemastersController',
        controllerAs: 'vm',
        resolve: {
          sizemasterResolve: newSizemaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sizemasters Create'
        }
      })
      .state('sizemasters.edit', {
        url: '/:sizemasterId/edit',
        templateUrl: 'modules/sizemasters/client/views/form-sizemaster.client.view.html',
        controller: 'SizemastersController',
        controllerAs: 'vm',
        resolve: {
          sizemasterResolve: getSizemaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sizemaster {{ sizemasterResolve.name }}'
        }
      })
      .state('sizemasters.view', {
        url: '/:sizemasterId',
        templateUrl: 'modules/sizemasters/client/views/view-sizemaster.client.view.html',
        controller: 'SizemastersController',
        controllerAs: 'vm',
        resolve: {
          sizemasterResolve: getSizemaster
        },
        data: {
          pageTitle: 'Sizemaster {{ sizemasterResolve.name }}'
        }
      });
  }

  getSizemaster.$inject = ['$stateParams', 'SizemastersService'];

  function getSizemaster($stateParams, SizemastersService) {
    return SizemastersService.get({
      sizemasterId: $stateParams.sizemasterId
    }).$promise;
  }

  newSizemaster.$inject = ['SizemastersService'];

  function newSizemaster(SizemastersService) {
    return new SizemastersService();
  }
}());
