(function () {
  'use strict';

  angular
    .module('cartmasters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cartmasters', {
        abstract: true,
        url: '/cartmasters',
        template: '<ui-view/>'
      })
      .state('cartmasters.list', {
        url: '',
        templateUrl: 'modules/cartmasters/client/views/list-cartmasters.client.view.html',
        controller: 'CartmastersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Cartmasters List'
        }
      })
      .state('cartmasters.create', {
        url: '/create',
        templateUrl: 'modules/cartmasters/client/views/form-cartmaster.client.view.html',
        controller: 'CartmastersController',
        controllerAs: 'vm',
        resolve: {
          cartmasterResolve: newCartmaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Cartmasters Create'
        }
      })
      .state('cartmasters.edit', {
        url: '/:cartmasterId/edit',
        templateUrl: 'modules/cartmasters/client/views/form-cartmaster.client.view.html',
        controller: 'CartmastersController',
        controllerAs: 'vm',
        resolve: {
          cartmasterResolve: getCartmaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Cartmaster {{ cartmasterResolve.name }}'
        }
      })
      .state('cartmasters.view', {
        url: '/:cartmasterId',
        templateUrl: 'modules/cartmasters/client/views/view-cartmaster.client.view.html',
        controller: 'CartmastersController',
        controllerAs: 'vm',
        resolve: {
          cartmasterResolve: getCartmaster
        },
        data: {
          pageTitle: 'Cartmaster {{ cartmasterResolve.name }}'
        }
      });
  }

  getCartmaster.$inject = ['$stateParams', 'CartmastersService'];

  function getCartmaster($stateParams, CartmastersService) {
    return CartmastersService.get({
      cartmasterId: $stateParams.cartmasterId
    }).$promise;
  }

  newCartmaster.$inject = ['CartmastersService'];

  function newCartmaster(CartmastersService) {
    return new CartmastersService();
  }
}());
