(function () {
  'use strict';

  angular
    .module('remodels')
    .controller('RemodelsListController', RemodelsListController);

  RemodelsListController.$inject = ['RemodelsService'];

  function RemodelsListController(RemodelsService) {
    var vm = this;

    vm.remodels = RemodelsService.query();
  }
}());
