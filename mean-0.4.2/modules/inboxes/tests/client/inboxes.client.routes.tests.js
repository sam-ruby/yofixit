(function () {
  'use strict';

  describe('Inboxes Route Tests', function () {
    // Initialize global variables
    var $scope,
      InboxesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InboxesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InboxesService = _InboxesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('inboxes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/inboxes');
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
          InboxesController,
          mockInbox;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('inboxes.view');
          $templateCache.put('modules/inboxes/client/views/view-inbox.client.view.html', '');

          // create mock Inbox
          mockInbox = new InboxesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inbox Name'
          });

          // Initialize Controller
          InboxesController = $controller('InboxesController as vm', {
            $scope: $scope,
            inboxResolve: mockInbox
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:inboxId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.inboxResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            inboxId: 1
          })).toEqual('/inboxes/1');
        }));

        it('should attach an Inbox to the controller scope', function () {
          expect($scope.vm.inbox._id).toBe(mockInbox._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/inboxes/client/views/view-inbox.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InboxesController,
          mockInbox;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('inboxes.create');
          $templateCache.put('modules/inboxes/client/views/form-inbox.client.view.html', '');

          // create mock Inbox
          mockInbox = new InboxesService();

          // Initialize Controller
          InboxesController = $controller('InboxesController as vm', {
            $scope: $scope,
            inboxResolve: mockInbox
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.inboxResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/inboxes/create');
        }));

        it('should attach an Inbox to the controller scope', function () {
          expect($scope.vm.inbox._id).toBe(mockInbox._id);
          expect($scope.vm.inbox._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/inboxes/client/views/form-inbox.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InboxesController,
          mockInbox;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('inboxes.edit');
          $templateCache.put('modules/inboxes/client/views/form-inbox.client.view.html', '');

          // create mock Inbox
          mockInbox = new InboxesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inbox Name'
          });

          // Initialize Controller
          InboxesController = $controller('InboxesController as vm', {
            $scope: $scope,
            inboxResolve: mockInbox
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:inboxId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.inboxResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            inboxId: 1
          })).toEqual('/inboxes/1/edit');
        }));

        it('should attach an Inbox to the controller scope', function () {
          expect($scope.vm.inbox._id).toBe(mockInbox._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/inboxes/client/views/form-inbox.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
