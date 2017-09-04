(function () {
  'use strict';

  // Cartmasters controller
  angular
    .module('cartmasters')
    .controller('CartmastersController', CartmastersController);

  CartmastersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'cartmasterResolve'];

  function CartmastersController ($scope, $state, $window, Authentication, cartmaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.cartmaster = cartmaster;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Cartmaster
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cartmaster.$remove($state.go('cartmasters.list'));
      }
    }

    // Save Cartmaster
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cartmasterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cartmaster._id) {
        vm.cartmaster.$update(successCallback, errorCallback);
      } else {
        vm.cartmaster.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cartmasters.view', {
          cartmasterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
