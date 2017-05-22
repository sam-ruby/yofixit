// Fixes service used to communicate Fixes REST endpoints
(function () {
  'use strict';

  angular
    .module('fixes')
    .factory('FixesService', FixesService);

  FixesService.$inject = ['$resource'];

  function FixesService($resource) {
    return $resource('api/fixes/:fixId', {
      fixId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
