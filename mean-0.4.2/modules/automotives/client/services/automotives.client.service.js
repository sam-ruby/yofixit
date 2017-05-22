// Automotives service used to communicate Automotives REST endpoints
(function () {
  'use strict';

  angular
    .module('automotives')
    .factory('AutomotivesService', AutomotivesService);

  AutomotivesService.$inject = ['$resource'];

  function AutomotivesService($resource) {
    return $resource('api/automotives/:automotiveId', {
      automotiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
