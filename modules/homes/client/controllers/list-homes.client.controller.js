(function () {
  'use strict';

  angular
    .module('homes')
    .controller('HomesListController', HomesListController);

  HomesListController.$inject = ['HomesService'];

  function HomesListController(HomesService) {
    var vm = this;

    vm.homes = HomesService.query();
  }
}());
