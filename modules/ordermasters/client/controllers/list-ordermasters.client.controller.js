(function () {
  'use strict';

  angular
    .module('ordermasters')
    .controller('OrdermastersListController', OrdermastersListController);

  OrdermastersListController.$inject = ['OrdermastersService'];

  function OrdermastersListController(OrdermastersService) {
    var vm = this;

    vm.ordermasters = OrdermastersService.query();
  }
}());
