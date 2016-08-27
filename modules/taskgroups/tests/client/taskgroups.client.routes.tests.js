(function () {
  'use strict';

  describe('Taskgroups Route Tests', function () {
    // Initialize global variables
    var $scope,
      TaskgroupsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TaskgroupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TaskgroupsService = _TaskgroupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('taskgroups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/taskgroups');
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
          TaskgroupsController,
          mockTaskgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('taskgroups.view');
          $templateCache.put('modules/taskgroups/client/views/view-taskgroup.client.view.html', '');

          // create mock Taskgroup
          mockTaskgroup = new TaskgroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Taskgroup Name'
          });

          //Initialize Controller
          TaskgroupsController = $controller('TaskgroupsController as vm', {
            $scope: $scope,
            taskgroupResolve: mockTaskgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:taskgroupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.taskgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            taskgroupId: 1
          })).toEqual('/taskgroups/1');
        }));

        it('should attach an Taskgroup to the controller scope', function () {
          expect($scope.vm.taskgroup._id).toBe(mockTaskgroup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/taskgroups/client/views/view-taskgroup.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TaskgroupsController,
          mockTaskgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('taskgroups.create');
          $templateCache.put('modules/taskgroups/client/views/form-taskgroup.client.view.html', '');

          // create mock Taskgroup
          mockTaskgroup = new TaskgroupsService();

          //Initialize Controller
          TaskgroupsController = $controller('TaskgroupsController as vm', {
            $scope: $scope,
            taskgroupResolve: mockTaskgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.taskgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/taskgroups/create');
        }));

        it('should attach an Taskgroup to the controller scope', function () {
          expect($scope.vm.taskgroup._id).toBe(mockTaskgroup._id);
          expect($scope.vm.taskgroup._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/taskgroups/client/views/form-taskgroup.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TaskgroupsController,
          mockTaskgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('taskgroups.edit');
          $templateCache.put('modules/taskgroups/client/views/form-taskgroup.client.view.html', '');

          // create mock Taskgroup
          mockTaskgroup = new TaskgroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Taskgroup Name'
          });

          //Initialize Controller
          TaskgroupsController = $controller('TaskgroupsController as vm', {
            $scope: $scope,
            taskgroupResolve: mockTaskgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:taskgroupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.taskgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            taskgroupId: 1
          })).toEqual('/taskgroups/1/edit');
        }));

        it('should attach an Taskgroup to the controller scope', function () {
          expect($scope.vm.taskgroup._id).toBe(mockTaskgroup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/taskgroups/client/views/form-taskgroup.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
