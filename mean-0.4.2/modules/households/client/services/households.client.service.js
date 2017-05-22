// Households service used to communicate Households REST endpoints
(function () {
  'use strict';

  angular
    .module('households')
    .factory('HouseholdsService', HouseholdsService);

  HouseholdsService.$inject = ['$resource'];

  function HouseholdsService($resource) {
    return $resource('api/households/:householdId', {
      householdId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
