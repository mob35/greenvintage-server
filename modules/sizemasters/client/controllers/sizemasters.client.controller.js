(function () {
  'use strict';

  // Sizemasters controller
  angular
    .module('sizemasters')
    .controller('SizemastersController', SizemastersController);

  SizemastersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sizemasterResolve'];

  function SizemastersController ($scope, $state, $window, Authentication, sizemaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sizemaster = sizemaster;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sizemaster
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sizemaster.$remove($state.go('sizemasters.list'));
      }
    }

    // Save Sizemaster
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sizemasterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sizemaster._id) {
        vm.sizemaster.$update(successCallback, errorCallback);
      } else {
        vm.sizemaster.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sizemasters.view', {
          sizemasterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
