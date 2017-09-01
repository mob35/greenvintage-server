(function () {
  'use strict';

  // Productmasters controller
  angular
    .module('productmasters')
    .controller('ProductmastersController', ProductmastersController);

  ProductmastersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'productmasterResolve'];

  function ProductmastersController ($scope, $state, $window, Authentication, productmaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.productmaster = productmaster;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Productmaster
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.productmaster.$remove($state.go('productmasters.list'));
      }
    }

    // Save Productmaster
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productmasterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.productmaster._id) {
        vm.productmaster.$update(successCallback, errorCallback);
      } else {
        vm.productmaster.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('productmasters.view', {
          productmasterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
