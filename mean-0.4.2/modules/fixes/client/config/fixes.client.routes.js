(function () {
  'use strict';

  angular
    .module('fixes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('fixes', {
        abstract: true,
        url: '/fixes',
        template: '<ui-view/>'
      })
      .state('fixes.list', {
        url: '',
        templateUrl: 'modules/fixes/client/views/list-fixes.client.view.html',
        controller: 'FixesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Fixes List'
        }
      })
      .state('fixes.create', {
        url: '/create',
        templateUrl: 'modules/fixes/client/views/form-fix.client.view.html',
        controller: 'FixesController',
        controllerAs: 'vm',
        resolve: {
          fixResolve: newFix
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Fixes Create'
        }
      })
      .state('fixes.edit', {
        url: '/:fixId/edit',
        templateUrl: 'modules/fixes/client/views/form-fix.client.view.html',
        controller: 'FixesController',
        controllerAs: 'vm',
        resolve: {
          fixResolve: getFix
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Fix {{ fixResolve.name }}'
        }
      })
      .state('fixes.view', {
        url: '/:fixId',
        templateUrl: 'modules/fixes/client/views/view-fix.client.view.html',
        controller: 'FixesController',
        controllerAs: 'vm',
        resolve: {
          fixResolve: getFix
        },
        data: {
          pageTitle: 'Fix {{ fixResolve.name }}'
        }
      });
  }

  getFix.$inject = ['$stateParams', 'FixesService'];

  function getFix($stateParams, FixesService) {
    return FixesService.get({
      fixId: $stateParams.fixId
    }).$promise;
  }

  newFix.$inject = ['FixesService'];

  function newFix(FixesService) {
    return new FixesService();
  }
}());
