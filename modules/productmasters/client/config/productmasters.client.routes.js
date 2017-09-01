(function () {
  'use strict';

  angular
    .module('productmasters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('productmasters', {
        abstract: true,
        url: '/productmasters',
        template: '<ui-view/>'
      })
      .state('productmasters.list', {
        url: '',
        templateUrl: 'modules/productmasters/client/views/list-productmasters.client.view.html',
        controller: 'ProductmastersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Productmasters List'
        }
      })
      .state('productmasters.create', {
        url: '/create',
        templateUrl: 'modules/productmasters/client/views/form-productmaster.client.view.html',
        controller: 'ProductmastersController',
        controllerAs: 'vm',
        resolve: {
          productmasterResolve: newProductmaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Productmasters Create'
        }
      })
      .state('productmasters.edit', {
        url: '/:productmasterId/edit',
        templateUrl: 'modules/productmasters/client/views/form-productmaster.client.view.html',
        controller: 'ProductmastersController',
        controllerAs: 'vm',
        resolve: {
          productmasterResolve: getProductmaster
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Productmaster {{ productmasterResolve.name }}'
        }
      })
      .state('productmasters.view', {
        url: '/:productmasterId',
        templateUrl: 'modules/productmasters/client/views/view-productmaster.client.view.html',
        controller: 'ProductmastersController',
        controllerAs: 'vm',
        resolve: {
          productmasterResolve: getProductmaster
        },
        data: {
          pageTitle: 'Productmaster {{ productmasterResolve.name }}'
        }
      });
  }

  getProductmaster.$inject = ['$stateParams', 'ProductmastersService'];

  function getProductmaster($stateParams, ProductmastersService) {
    return ProductmastersService.get({
      productmasterId: $stateParams.productmasterId
    }).$promise;
  }

  newProductmaster.$inject = ['ProductmastersService'];

  function newProductmaster(ProductmastersService) {
    return new ProductmastersService();
  }
}());
