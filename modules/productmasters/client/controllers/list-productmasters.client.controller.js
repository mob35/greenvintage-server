(function () {
  'use strict';

  angular
    .module('productmasters')
    .controller('ProductmastersListController', ProductmastersListController);

  ProductmastersListController.$inject = ['ProductmastersService'];

  function ProductmastersListController(ProductmastersService) {
    var vm = this;

    vm.productmasters = ProductmastersService.query();
  }
}());
