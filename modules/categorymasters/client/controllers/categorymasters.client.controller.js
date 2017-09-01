(function () {
  'use strict';

  // Categorymasters controller
  angular
    .module('categorymasters')
    .controller('CategorymastersController', CategorymastersController);

  CategorymastersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'categorymasterResolve'];

  function CategorymastersController ($scope, $state, $window, Authentication, categorymaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.categorymaster = categorymaster;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Categorymaster
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.categorymaster.$remove($state.go('categorymasters.list'));
      }
    }

    // Save Categorymaster
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.categorymasterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.categorymaster._id) {
        vm.categorymaster.$update(successCallback, errorCallback);
      } else {
        vm.categorymaster.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('categorymasters.view', {
          categorymasterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
