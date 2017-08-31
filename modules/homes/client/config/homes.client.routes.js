(function () {
  'use strict';

  angular
    .module('homes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('homes', {
        abstract: true,
        url: '/homes',
        template: '<ui-view/>'
      })
      .state('homes.list', {
        url: '',
        templateUrl: 'modules/homes/client/views/list-homes.client.view.html',
        controller: 'HomesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Homes List'
        }
      })
      .state('homes.create', {
        url: '/create',
        templateUrl: 'modules/homes/client/views/form-home.client.view.html',
        controller: 'HomesController',
        controllerAs: 'vm',
        resolve: {
          homeResolve: newHome
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Homes Create'
        }
      })
      .state('homes.edit', {
        url: '/:homeId/edit',
        templateUrl: 'modules/homes/client/views/form-home.client.view.html',
        controller: 'HomesController',
        controllerAs: 'vm',
        resolve: {
          homeResolve: getHome
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Home {{ homeResolve.name }}'
        }
      })
      .state('homes.view', {
        url: '/:homeId',
        templateUrl: 'modules/homes/client/views/view-home.client.view.html',
        controller: 'HomesController',
        controllerAs: 'vm',
        resolve: {
          homeResolve: getHome
        },
        data: {
          pageTitle: 'Home {{ homeResolve.name }}'
        }
      });
  }

  getHome.$inject = ['$stateParams', 'HomesService'];

  function getHome($stateParams, HomesService) {
    return HomesService.get({
      homeId: $stateParams.homeId
    }).$promise;
  }

  newHome.$inject = ['HomesService'];

  function newHome(HomesService) {
    return new HomesService();
  }
}());
