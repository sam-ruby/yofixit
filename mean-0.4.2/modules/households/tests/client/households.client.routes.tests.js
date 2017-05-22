(function () {
  'use strict';

  describe('Households Route Tests', function () {
    // Initialize global variables
    var $scope,
      HouseholdsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HouseholdsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HouseholdsService = _HouseholdsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('households');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/households');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          HouseholdsController,
          mockHousehold;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('households.view');
          $templateCache.put('modules/households/client/views/view-household.client.view.html', '');

          // create mock Household
          mockHousehold = new HouseholdsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Household Name'
          });

          // Initialize Controller
          HouseholdsController = $controller('HouseholdsController as vm', {
            $scope: $scope,
            householdResolve: mockHousehold
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:householdId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.householdResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            householdId: 1
          })).toEqual('/households/1');
        }));

        it('should attach an Household to the controller scope', function () {
          expect($scope.vm.household._id).toBe(mockHousehold._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/households/client/views/view-household.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HouseholdsController,
          mockHousehold;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('households.create');
          $templateCache.put('modules/households/client/views/form-household.client.view.html', '');

          // create mock Household
          mockHousehold = new HouseholdsService();

          // Initialize Controller
          HouseholdsController = $controller('HouseholdsController as vm', {
            $scope: $scope,
            householdResolve: mockHousehold
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.householdResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/households/create');
        }));

        it('should attach an Household to the controller scope', function () {
          expect($scope.vm.household._id).toBe(mockHousehold._id);
          expect($scope.vm.household._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/households/client/views/form-household.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HouseholdsController,
          mockHousehold;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('households.edit');
          $templateCache.put('modules/households/client/views/form-household.client.view.html', '');

          // create mock Household
          mockHousehold = new HouseholdsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Household Name'
          });

          // Initialize Controller
          HouseholdsController = $controller('HouseholdsController as vm', {
            $scope: $scope,
            householdResolve: mockHousehold
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:householdId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.householdResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            householdId: 1
          })).toEqual('/households/1/edit');
        }));

        it('should attach an Household to the controller scope', function () {
          expect($scope.vm.household._id).toBe(mockHousehold._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/households/client/views/form-household.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
