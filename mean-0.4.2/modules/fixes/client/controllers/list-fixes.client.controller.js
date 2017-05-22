(function () {
  'use strict';

  angular
    .module('fixes')
    .controller('FixesListController', FixesListController);

  FixesListController.$inject = ['FixesService'];

  function FixesListController(FixesService) {
    var vm = this;

    vm.fixes = FixesService.query();
  }
}());
