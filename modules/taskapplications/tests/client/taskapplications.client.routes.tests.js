(function () {
  'use strict';

  describe('Taskapplications Route Tests', function () {
    // Initialize global variables
    var $scope,
      TaskapplicationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TaskapplicationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TaskapplicationsService = _TaskapplicationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('taskapplications');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/taskapplications');
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
          TaskapplicationsController,
          mockTaskapplication;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('taskapplications.view');
          $templateCache.put('modules/taskapplications/client/views/view-taskapplication.client.view.html', '');

          // create mock Taskapplication
          mockTaskapplication = new TaskapplicationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Taskapplication Name'
          });

          //Initialize Controller
          TaskapplicationsController = $controller('TaskapplicationsController as vm', {
            $scope: $scope,
            taskapplicationResolve: mockTaskapplication
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:taskapplicationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.taskapplicationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            taskapplicationId: 1
          })).toEqual('/taskapplications/1');
        }));

        it('should attach an Taskapplication to the controller scope', function () {
          expect($scope.vm.taskapplication._id).toBe(mockTaskapplication._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/taskapplications/client/views/view-taskapplication.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TaskapplicationsController,
          mockTaskapplication;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('taskapplications.create');
          $templateCache.put('modules/taskapplications/client/views/form-taskapplication.client.view.html', '');

          // create mock Taskapplication
          mockTaskapplication = new TaskapplicationsService();

          //Initialize Controller
          TaskapplicationsController = $controller('TaskapplicationsController as vm', {
            $scope: $scope,
            taskapplicationResolve: mockTaskapplication
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.taskapplicationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/taskapplications/create');
        }));

        it('should attach an Taskapplication to the controller scope', function () {
          expect($scope.vm.taskapplication._id).toBe(mockTaskapplication._id);
          expect($scope.vm.taskapplication._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/taskapplications/client/views/form-taskapplication.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TaskapplicationsController,
          mockTaskapplication;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('taskapplications.edit');
          $templateCache.put('modules/taskapplications/client/views/form-taskapplication.client.view.html', '');

          // create mock Taskapplication
          mockTaskapplication = new TaskapplicationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Taskapplication Name'
          });

          //Initialize Controller
          TaskapplicationsController = $controller('TaskapplicationsController as vm', {
            $scope: $scope,
            taskapplicationResolve: mockTaskapplication
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:taskapplicationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.taskapplicationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            taskapplicationId: 1
          })).toEqual('/taskapplications/1/edit');
        }));

        it('should attach an Taskapplication to the controller scope', function () {
          expect($scope.vm.taskapplication._id).toBe(mockTaskapplication._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/taskapplications/client/views/form-taskapplication.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
