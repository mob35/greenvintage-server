(function () {
  'use strict';

  angular
    .module('shopmasters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('shopmasters', {
        abstract: true,
        url: '/shopmasters',
        template: '<ui-view/>'
      })
      .state('shopmasters.list', {
        url: '',
        templateUrl: 'modules/shopmasters/client/views/list-shopmasters.client.view.html',
        controller: 'ShopmastersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Shopmasters List'
        }
      })
      .state('shopmasters.create', {
        url: '/create',
        templateUrl: 'modules/shopmasters/client/views/form-shopmaster.client.view.html',
        controller: 'ShopmastersController',
        controllerAs: 'vm',
        resolve: {
          shopmasterResolve: newShopmaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Shopmasters Create'
        }
      })
      .state('shopmasters.edit', {
        url: '/:shopmasterId/edit',
        templateUrl: 'modules/shopmasters/client/views/form-shopmaster.client.view.html',
        controller: 'ShopmastersController',
        controllerAs: 'vm',
        resolve: {
          shopmasterResolve: getShopmaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Shopmaster {{ shopmasterResolve.name }}'
        }
      })
      .state('shopmasters.view', {
        url: '/:shopmasterId',
        templateUrl: 'modules/shopmasters/client/views/view-shopmaster.client.view.html',
        controller: 'ShopmastersController',
        controllerAs: 'vm',
        resolve: {
          shopmasterResolve: getShopmaster
        },
        data: {
          pageTitle: 'Shopmaster {{ shopmasterResolve.name }}'
        }
      });
  }

  getShopmaster.$inject = ['$stateParams', 'ShopmastersService'];

  function getShopmaster($stateParams, ShopmastersService) {
    return ShopmastersService.get({
      shopmasterId: $stateParams.shopmasterId
    }).$promise;
  }

  newShopmaster.$inject = ['ShopmastersService'];

  function newShopmaster(ShopmastersService) {
    return new ShopmastersService();
  }
}());
