(function () {
  'use strict';

  angular
    .module('automotives')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('automotives', {
        abstract: true,
        url: '/automotives',
        template: '<ui-view/>'
      })
      .state('automotives.list', {
        url: '',
        templateUrl: 'modules/automotives/client/views/list-automotives.client.view.html',
        controller: 'AutomotivesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Automotives List'
        }
      })
      .state('automotives.create', {
        url: '/create',
        templateUrl: 'modules/automotives/client/views/form-automotive.client.view.html',
        controller: 'AutomotivesController',
        controllerAs: 'vm',
        resolve: {
          automotiveResolve: newAutomotive
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Automotives Create'
        }
      })
      .state('automotives.edit', {
        url: '/:automotiveId/edit',
        templateUrl: 'modules/automotives/client/views/form-automotive.client.view.html',
        controller: 'AutomotivesController',
        controllerAs: 'vm',
        resolve: {
          automotiveResolve: getAutomotive
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Automotive {{ automotiveResolve.name }}'
        }
      })
      .state('automotives.view', {
        url: '/:automotiveId',
        templateUrl: 'modules/automotives/client/views/view-automotive.client.view.html',
        controller: 'AutomotivesController',
        controllerAs: 'vm',
        resolve: {
          automotiveResolve: getAutomotive
        },
        data: {
          pageTitle: 'Automotive {{ automotiveResolve.name }}'
        }
      });
  }

  getAutomotive.$inject = ['$stateParams', 'AutomotivesService'];

  function getAutomotive($stateParams, AutomotivesService) {
    return AutomotivesService.get({
      automotiveId: $stateParams.automotiveId
    }).$promise;
  }

  newAutomotive.$inject = ['AutomotivesService'];

  function newAutomotive(AutomotivesService) {
    return new AutomotivesService();
  }
}());
