(function () {
  'use strict';

  angular
    .module('inboxes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('inboxes', {
        abstract: true,
        url: '/inboxes',
        template: '<ui-view/>'
      })
      .state('inboxes.list', {
        url: '',
        templateUrl: 'modules/inboxes/client/views/list-inboxes.client.view.html',
        controller: 'InboxesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Inboxes List'
        }
      })
      .state('inboxes.create', {
        url: '/create',
        templateUrl: 'modules/inboxes/client/views/form-inbox.client.view.html',
        controller: 'InboxesController',
        controllerAs: 'vm',
        resolve: {
          inboxResolve: newInbox
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Inboxes Create'
        }
      })
      .state('inboxes.edit', {
        url: '/:inboxId/edit',
        templateUrl: 'modules/inboxes/client/views/form-inbox.client.view.html',
        controller: 'InboxesController',
        controllerAs: 'vm',
        resolve: {
          inboxResolve: getInbox
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Inbox {{ inboxResolve.name }}'
        }
      })
      .state('inboxes.view', {
        url: '/:inboxId',
        templateUrl: 'modules/inboxes/client/views/view-inbox.client.view.html',
        controller: 'InboxesController',
        controllerAs: 'vm',
        resolve: {
          inboxResolve: getInbox
        },
        data: {
          pageTitle: 'Inbox {{ inboxResolve.name }}'
        }
      });
  }

  getInbox.$inject = ['$stateParams', 'InboxesService'];

  function getInbox($stateParams, InboxesService) {
    return InboxesService.get({
      inboxId: $stateParams.inboxId
    }).$promise;
  }

  newInbox.$inject = ['InboxesService'];

  function newInbox(InboxesService) {
    return new InboxesService();
  }
}());
