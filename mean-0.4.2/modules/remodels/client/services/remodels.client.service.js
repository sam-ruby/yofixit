// Remodels service used to communicate Remodels REST endpoints
(function () {
  'use strict';

  angular
    .module('remodels')
    .factory('RemodelsService', RemodelsService);

  RemodelsService.$inject = ['$resource'];

  function RemodelsService($resource) {
    return $resource('api/remodels/:remodelId', {
      remodelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
