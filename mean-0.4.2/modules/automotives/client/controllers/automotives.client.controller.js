(function () {
  'use strict';

  // Automotives controller
  angular
    .module('automotives')
    .controller('AutomotivesController', AutomotivesController);

  AutomotivesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'automotiveResolve'];

  function AutomotivesController ($scope, $state, $window, Authentication, automotive) {
    var vm = this;

    vm.authentication = Authentication;
    vm.automotive = automotive;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Automotive
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.automotive.$remove($state.go('automotives.list'));
      }
    }

    // Save Automotive
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.automotiveForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.automotive._id) {
        vm.automotive.$update(successCallback, errorCallback);
      } else {
        vm.automotive.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('automotives.view', {
          automotiveId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
