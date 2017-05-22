(function () {
  'use strict';

  describe('Fixes Route Tests', function () {
    // Initialize global variables
    var $scope,
      FixesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FixesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FixesService = _FixesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('fixes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/fixes');
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
          FixesController,
          mockFix;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('fixes.view');
          $templateCache.put('modules/fixes/client/views/view-fix.client.view.html', '');

          // create mock Fix
          mockFix = new FixesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Fix Name'
          });

          // Initialize Controller
          FixesController = $controller('FixesController as vm', {
            $scope: $scope,
            fixResolve: mockFix
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:fixId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.fixResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            fixId: 1
          })).toEqual('/fixes/1');
        }));

        it('should attach an Fix to the controller scope', function () {
          expect($scope.vm.fix._id).toBe(mockFix._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/fixes/client/views/view-fix.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FixesController,
          mockFix;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('fixes.create');
          $templateCache.put('modules/fixes/client/views/form-fix.client.view.html', '');

          // create mock Fix
          mockFix = new FixesService();

          // Initialize Controller
          FixesController = $controller('FixesController as vm', {
            $scope: $scope,
            fixResolve: mockFix
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.fixResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/fixes/create');
        }));

        it('should attach an Fix to the controller scope', function () {
          expect($scope.vm.fix._id).toBe(mockFix._id);
          expect($scope.vm.fix._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/fixes/client/views/form-fix.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FixesController,
          mockFix;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('fixes.edit');
          $templateCache.put('modules/fixes/client/views/form-fix.client.view.html', '');

          // create mock Fix
          mockFix = new FixesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Fix Name'
          });

          // Initialize Controller
          FixesController = $controller('FixesController as vm', {
            $scope: $scope,
            fixResolve: mockFix
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:fixId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.fixResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            fixId: 1
          })).toEqual('/fixes/1/edit');
        }));

        it('should attach an Fix to the controller scope', function () {
          expect($scope.vm.fix._id).toBe(mockFix._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/fixes/client/views/form-fix.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
