(function () {
  'use strict';

  // Fixes controller
  angular
    .module('fixes')
    .controller('FixesController', FixesController);

  FixesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'fixResolve'];

  function FixesController ($scope, $state, $window, Authentication, fix) {
    var vm = this;

    vm.authentication = Authentication;
    vm.fix = fix;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // Remove existing Fix
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.fix.$remove($state.go('fixes.list'));
      }
    }

    // Save Fix
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.fixForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.fix._id) {
        vm.fix.$update(successCallback, errorCallback);
      } else {
        vm.fix.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('fixes.view', {
          fixId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
