(function () {
  'use strict';

  // Homes controller
  angular
    .module('homes')
    .controller('HomesController', HomesController);

  HomesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'homeResolve'];

  function HomesController ($scope, $state, $window, Authentication, home) {
    var vm = this;

    vm.authentication = Authentication;
    vm.home = home;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Home
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.home.$remove($state.go('homes.list'));
      }
    }

    // Save Home
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.homeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.home._id) {
        vm.home.$update(successCallback, errorCallback);
      } else {
        vm.home.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('homes.view', {
          homeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
