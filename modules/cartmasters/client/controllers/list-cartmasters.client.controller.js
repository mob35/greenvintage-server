(function () {
  'use strict';

  angular
    .module('cartmasters')
    .controller('CartmastersListController', CartmastersListController);

  CartmastersListController.$inject = ['CartmastersService'];

  function CartmastersListController(CartmastersService) {
    var vm = this;

    vm.cartmasters = CartmastersService.query();
  }
}());
