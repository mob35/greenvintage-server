(function () {
  'use strict';

  angular
    .module('sizemasters')
    .controller('SizemastersListController', SizemastersListController);

  SizemastersListController.$inject = ['SizemastersService'];

  function SizemastersListController(SizemastersService) {
    var vm = this;

    vm.sizemasters = SizemastersService.query();
  }
}());
