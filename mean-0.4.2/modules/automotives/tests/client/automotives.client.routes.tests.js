(function () {
  'use strict';

  describe('Automotives Route Tests', function () {
    // Initialize global variables
    var $scope,
      AutomotivesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AutomotivesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AutomotivesService = _AutomotivesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('automotives');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/automotives');
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
          AutomotivesController,
          mockAutomotive;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('automotives.view');
          $templateCache.put('modules/automotives/client/views/view-automotive.client.view.html', '');

          // create mock Automotive
          mockAutomotive = new AutomotivesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Automotive Name'
          });

          // Initialize Controller
          AutomotivesController = $controller('AutomotivesController as vm', {
            $scope: $scope,
            automotiveResolve: mockAutomotive
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:automotiveId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.automotiveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            automotiveId: 1
          })).toEqual('/automotives/1');
        }));

        it('should attach an Automotive to the controller scope', function () {
          expect($scope.vm.automotive._id).toBe(mockAutomotive._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/automotives/client/views/view-automotive.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AutomotivesController,
          mockAutomotive;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('automotives.create');
          $templateCache.put('modules/automotives/client/views/form-automotive.client.view.html', '');

          // create mock Automotive
          mockAutomotive = new AutomotivesService();

          // Initialize Controller
          AutomotivesController = $controller('AutomotivesController as vm', {
            $scope: $scope,
            automotiveResolve: mockAutomotive
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.automotiveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/automotives/create');
        }));

        it('should attach an Automotive to the controller scope', function () {
          expect($scope.vm.automotive._id).toBe(mockAutomotive._id);
          expect($scope.vm.automotive._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/automotives/client/views/form-automotive.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AutomotivesController,
          mockAutomotive;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('automotives.edit');
          $templateCache.put('modules/automotives/client/views/form-automotive.client.view.html', '');

          // create mock Automotive
          mockAutomotive = new AutomotivesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Automotive Name'
          });

          // Initialize Controller
          AutomotivesController = $controller('AutomotivesController as vm', {
            $scope: $scope,
            automotiveResolve: mockAutomotive
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:automotiveId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.automotiveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            automotiveId: 1
          })).toEqual('/automotives/1/edit');
        }));

        it('should attach an Automotive to the controller scope', function () {
          expect($scope.vm.automotive._id).toBe(mockAutomotive._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/automotives/client/views/form-automotive.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
