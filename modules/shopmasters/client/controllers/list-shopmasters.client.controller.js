(function () {
  'use strict';

  angular
    .module('shopmasters')
    .controller('ShopmastersListController', ShopmastersListController);

  ShopmastersListController.$inject = ['ShopmastersService'];

  function ShopmastersListController(ShopmastersService) {
    var vm = this;

    vm.shopmasters = ShopmastersService.query();
  }
}());
