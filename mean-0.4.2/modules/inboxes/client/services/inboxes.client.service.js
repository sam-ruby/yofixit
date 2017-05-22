// Inboxes service used to communicate Inboxes REST endpoints
(function () {
  'use strict';

  angular
    .module('inboxes')
    .factory('InboxesService', InboxesService);

  InboxesService.$inject = ['$resource'];

  function InboxesService($resource) {
    return $resource('api/inboxes/:inboxId', {
      inboxId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
