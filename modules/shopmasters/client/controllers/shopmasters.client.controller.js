(function () {
  'use strict';

  // Shopmasters controller
  angular
    .module('shopmasters')
    .controller('ShopmastersController', ShopmastersController);

  ShopmastersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'shopmasterResolve'];

  function ShopmastersController ($scope, $state, $window, Authentication, shopmaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.shopmaster = shopmaster;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Shopmaster
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.shopmaster.$remove($state.go('shopmasters.list'));
      }
    }

    // Save Shopmaster
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shopmasterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.shopmaster._id) {
        vm.shopmaster.$update(successCallback, errorCallback);
      } else {
        vm.shopmaster.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('shopmasters.view', {
          shopmasterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
