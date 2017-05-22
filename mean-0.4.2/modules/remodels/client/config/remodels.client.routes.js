(function () {
  'use strict';

  angular
    .module('remodels')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('remodels', {
        abstract: true,
        url: '/remodels',
        template: '<ui-view/>'
      })
      .state('remodels.list', {
        url: '',
        templateUrl: 'modules/remodels/client/views/list-remodels.client.view.html',
        controller: 'RemodelsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Remodels List'
        }
      })
      .state('remodels.create', {
        url: '/create',
        templateUrl: 'modules/remodels/client/views/form-remodel.client.view.html',
        controller: 'RemodelsController',
        controllerAs: 'vm',
        resolve: {
          remodelResolve: newRemodel
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Remodels Create'
        }
      })
      .state('remodels.edit', {
        url: '/:remodelId/edit',
        templateUrl: 'modules/remodels/client/views/form-remodel.client.view.html',
        controller: 'RemodelsController',
        controllerAs: 'vm',
        resolve: {
          remodelResolve: getRemodel
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Remodel {{ remodelResolve.name }}'
        }
      })
      .state('remodels.view', {
        url: '/:remodelId',
        templateUrl: 'modules/remodels/client/views/view-remodel.client.view.html',
        controller: 'RemodelsController',
        controllerAs: 'vm',
        resolve: {
          remodelResolve: getRemodel
        },
        data: {
          pageTitle: 'Remodel {{ remodelResolve.name }}'
        }
      });
  }

  getRemodel.$inject = ['$stateParams', 'RemodelsService'];

  function getRemodel($stateParams, RemodelsService) {
    return RemodelsService.get({
      remodelId: $stateParams.remodelId
    }).$promise;
  }

  newRemodel.$inject = ['RemodelsService'];

  function newRemodel(RemodelsService) {
    return new RemodelsService();
  }
}());
