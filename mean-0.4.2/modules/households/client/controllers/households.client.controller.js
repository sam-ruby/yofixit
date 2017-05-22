(function () {
  'use strict';

  // Households controller
  angular
    .module('households')
    .controller('HouseholdsController', HouseholdsController);

  HouseholdsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'householdResolve'];

  function HouseholdsController ($scope, $state, $window, Authentication, household) {
    var vm = this;

    vm.authentication = Authentication;
    vm.household = household;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Household
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.household.$remove($state.go('households.list'));
      }
    }

    // Save Household
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.householdForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.household._id) {
        vm.household.$update(successCallback, errorCallback);
      } else {
        vm.household.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('households.view', {
          householdId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
