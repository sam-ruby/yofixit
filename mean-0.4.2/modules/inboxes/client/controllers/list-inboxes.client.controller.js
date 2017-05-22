(function () {
  'use strict';

  angular
    .module('inboxes')
    .controller('InboxesListController', InboxesListController);

  InboxesListController.$inject = ['InboxesService'];

  function InboxesListController(InboxesService) {
    var vm = this;

    vm.inboxes = InboxesService.query();
  }
}());
