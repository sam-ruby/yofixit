(function () {
  'use strict';

  angular
    .module('households')
    .controller('HouseholdsListController', HouseholdsListController);

  HouseholdsListController.$inject = ['HouseholdsService'];

  function HouseholdsListController(HouseholdsService) {
    var vm = this;

    vm.households = HouseholdsService.query();
  }
}());
