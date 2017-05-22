(function () {
  'use strict';

  describe('Remodels Route Tests', function () {
    // Initialize global variables
    var $scope,
      RemodelsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RemodelsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RemodelsService = _RemodelsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('remodels');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/remodels');
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
          RemodelsController,
          mockRemodel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('remodels.view');
          $templateCache.put('modules/remodels/client/views/view-remodel.client.view.html', '');

          // create mock Remodel
          mockRemodel = new RemodelsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Remodel Name'
          });

          // Initialize Controller
          RemodelsController = $controller('RemodelsController as vm', {
            $scope: $scope,
            remodelResolve: mockRemodel
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:remodelId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.remodelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            remodelId: 1
          })).toEqual('/remodels/1');
        }));

        it('should attach an Remodel to the controller scope', function () {
          expect($scope.vm.remodel._id).toBe(mockRemodel._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/remodels/client/views/view-remodel.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RemodelsController,
          mockRemodel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('remodels.create');
          $templateCache.put('modules/remodels/client/views/form-remodel.client.view.html', '');

          // create mock Remodel
          mockRemodel = new RemodelsService();

          // Initialize Controller
          RemodelsController = $controller('RemodelsController as vm', {
            $scope: $scope,
            remodelResolve: mockRemodel
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.remodelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/remodels/create');
        }));

        it('should attach an Remodel to the controller scope', function () {
          expect($scope.vm.remodel._id).toBe(mockRemodel._id);
          expect($scope.vm.remodel._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/remodels/client/views/form-remodel.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RemodelsController,
          mockRemodel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('remodels.edit');
          $templateCache.put('modules/remodels/client/views/form-remodel.client.view.html', '');

          // create mock Remodel
          mockRemodel = new RemodelsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Remodel Name'
          });

          // Initialize Controller
          RemodelsController = $controller('RemodelsController as vm', {
            $scope: $scope,
            remodelResolve: mockRemodel
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:remodelId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.remodelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            remodelId: 1
          })).toEqual('/remodels/1/edit');
        }));

        it('should attach an Remodel to the controller scope', function () {
          expect($scope.vm.remodel._id).toBe(mockRemodel._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/remodels/client/views/form-remodel.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
