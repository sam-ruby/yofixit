(function () {
  'use strict';

  angular
    .module('automotives')
    .controller('AutomotivesListController', AutomotivesListController);

  AutomotivesListController.$inject = ['AutomotivesService'];

  function AutomotivesListController(AutomotivesService) {
    var vm = this;

    vm.automotives = AutomotivesService.query();
  }
}());
