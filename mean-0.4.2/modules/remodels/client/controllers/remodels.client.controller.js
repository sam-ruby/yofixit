(function () {
  'use strict';

  // Remodels controller
  angular
    .module('remodels')
    .controller('RemodelsController', RemodelsController);

  RemodelsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'remodelResolve'];

  function RemodelsController ($scope, $state, $window, Authentication, remodel) {
    var vm = this;

    vm.authentication = Authentication;
    vm.remodel = remodel;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Remodel
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.remodel.$remove($state.go('remodels.list'));
      }
    }

    // Save Remodel
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.remodelForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.remodel._id) {
        vm.remodel.$update(successCallback, errorCallback);
      } else {
        vm.remodel.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('remodels.view', {
          remodelId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
