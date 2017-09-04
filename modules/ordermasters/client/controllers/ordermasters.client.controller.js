(function () {
  'use strict';

  // Ordermasters controller
  angular
    .module('ordermasters')
    .controller('OrdermastersController', OrdermastersController);

  OrdermastersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'ordermasterResolve'];

  function OrdermastersController ($scope, $state, $window, Authentication, ordermaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ordermaster = ordermaster;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ordermaster
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.ordermaster.$remove($state.go('ordermasters.list'));
      }
    }

    // Save Ordermaster
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ordermasterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ordermaster._id) {
        vm.ordermaster.$update(successCallback, errorCallback);
      } else {
        vm.ordermaster.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ordermasters.view', {
          ordermasterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
