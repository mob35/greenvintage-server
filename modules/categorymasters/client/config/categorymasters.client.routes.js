(function () {
  'use strict';

  angular
    .module('categorymasters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('categorymasters', {
        abstract: true,
        url: '/categorymasters',
        template: '<ui-view/>'
      })
      .state('categorymasters.list', {
        url: '',
        templateUrl: 'modules/categorymasters/client/views/list-categorymasters.client.view.html',
        controller: 'CategorymastersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Categorymasters List'
        }
      })
      .state('categorymasters.create', {
        url: '/create',
        templateUrl: 'modules/categorymasters/client/views/form-categorymaster.client.view.html',
        controller: 'CategorymastersController',
        controllerAs: 'vm',
        resolve: {
          categorymasterResolve: newCategorymaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Categorymasters Create'
        }
      })
      .state('categorymasters.edit', {
        url: '/:categorymasterId/edit',
        templateUrl: 'modules/categorymasters/client/views/form-categorymaster.client.view.html',
        controller: 'CategorymastersController',
        controllerAs: 'vm',
        resolve: {
          categorymasterResolve: getCategorymaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Categorymaster {{ categorymasterResolve.name }}'
        }
      })
      .state('categorymasters.view', {
        url: '/:categorymasterId',
        templateUrl: 'modules/categorymasters/client/views/view-categorymaster.client.view.html',
        controller: 'CategorymastersController',
        controllerAs: 'vm',
        resolve: {
          categorymasterResolve: getCategorymaster
        },
        data: {
          pageTitle: 'Categorymaster {{ categorymasterResolve.name }}'
        }
      });
  }

  getCategorymaster.$inject = ['$stateParams', 'CategorymastersService'];

  function getCategorymaster($stateParams, CategorymastersService) {
    return CategorymastersService.get({
      categorymasterId: $stateParams.categorymasterId
    }).$promise;
  }

  newCategorymaster.$inject = ['CategorymastersService'];

  function newCategorymaster(CategorymastersService) {
    return new CategorymastersService();
  }
}());
