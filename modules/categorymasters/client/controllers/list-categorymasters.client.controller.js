(function () {
  'use strict';

  angular
    .module('categorymasters')
    .controller('CategorymastersListController', CategorymastersListController);

  CategorymastersListController.$inject = ['CategorymastersService'];

  function CategorymastersListController(CategorymastersService) {
    var vm = this;

    vm.categorymasters = CategorymastersService.query();
  }
}());
