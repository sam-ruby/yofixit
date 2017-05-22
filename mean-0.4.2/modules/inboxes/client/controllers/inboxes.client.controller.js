(function () {
  'use strict';

  // Inboxes controller
  angular
    .module('inboxes')
    .controller('InboxesController', InboxesController);

  InboxesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'inboxResolve'];

  function InboxesController ($scope, $state, $window, Authentication, inbox) {
    var vm = this;

    vm.authentication = Authentication;
    vm.inbox = inbox;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Inbox
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.inbox.$remove($state.go('inboxes.list'));
      }
    }

    // Save Inbox
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.inboxForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.inbox._id) {
        vm.inbox.$update(successCallback, errorCallback);
      } else {
        vm.inbox.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('inboxes.view', {
          inboxId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
