(function () {
  'use strict';

  angular
    .module('ordermasters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ordermasters', {
        abstract: true,
        url: '/ordermasters',
        template: '<ui-view/>'
      })
      .state('ordermasters.list', {
        url: '',
        templateUrl: 'modules/ordermasters/client/views/list-ordermasters.client.view.html',
        controller: 'OrdermastersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ordermasters List'
        }
      })
      .state('ordermasters.create', {
        url: '/create',
        templateUrl: 'modules/ordermasters/client/views/form-ordermaster.client.view.html',
        controller: 'OrdermastersController',
        controllerAs: 'vm',
        resolve: {
          ordermasterResolve: newOrdermaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Ordermasters Create'
        }
      })
      .state('ordermasters.edit', {
        url: '/:ordermasterId/edit',
        templateUrl: 'modules/ordermasters/client/views/form-ordermaster.client.view.html',
        controller: 'OrdermastersController',
        controllerAs: 'vm',
        resolve: {
          ordermasterResolve: getOrdermaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ordermaster {{ ordermasterResolve.name }}'
        }
      })
      .state('ordermasters.view', {
        url: '/:ordermasterId',
        templateUrl: 'modules/ordermasters/client/views/view-ordermaster.client.view.html',
        controller: 'OrdermastersController',
        controllerAs: 'vm',
        resolve: {
          ordermasterResolve: getOrdermaster
        },
        data: {
          pageTitle: 'Ordermaster {{ ordermasterResolve.name }}'
        }
      });
  }

  getOrdermaster.$inject = ['$stateParams', 'OrdermastersService'];

  function getOrdermaster($stateParams, OrdermastersService) {
    return OrdermastersService.get({
      ordermasterId: $stateParams.ordermasterId
    }).$promise;
  }

  newOrdermaster.$inject = ['OrdermastersService'];

  function newOrdermaster(OrdermastersService) {
    return new OrdermastersService();
  }
}());
