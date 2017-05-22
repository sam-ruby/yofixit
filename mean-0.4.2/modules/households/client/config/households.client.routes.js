(function () {
  'use strict';

  angular
    .module('households')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('households', {
        abstract: true,
        url: '/households',
        template: '<ui-view/>'
      })
      .state('households.list', {
        url: '',
        templateUrl: 'modules/households/client/views/list-households.client.view.html',
        controller: 'HouseholdsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Households List'
        }
      })
      .state('households.create', {
        url: '/create',
        templateUrl: 'modules/households/client/views/form-household.client.view.html',
        controller: 'HouseholdsController',
        controllerAs: 'vm',
        resolve: {
          householdResolve: newHousehold
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Households Create'
        }
      })
      .state('households.edit', {
        url: '/:householdId/edit',
        templateUrl: 'modules/households/client/views/form-household.client.view.html',
        controller: 'HouseholdsController',
        controllerAs: 'vm',
        resolve: {
          householdResolve: getHousehold
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Household {{ householdResolve.name }}'
        }
      })
      .state('households.view', {
        url: '/:householdId',
        templateUrl: 'modules/households/client/views/view-household.client.view.html',
        controller: 'HouseholdsController',
        controllerAs: 'vm',
        resolve: {
          householdResolve: getHousehold
        },
        data: {
          pageTitle: 'Household {{ householdResolve.name }}'
        }
      });
  }

  getHousehold.$inject = ['$stateParams', 'HouseholdsService'];

  function getHousehold($stateParams, HouseholdsService) {
    return HouseholdsService.get({
      householdId: $stateParams.householdId
    }).$promise;
  }

  newHousehold.$inject = ['HouseholdsService'];

  function newHousehold(HouseholdsService) {
    return new HouseholdsService();
  }
}());
