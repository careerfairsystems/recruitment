(function () {
  'use strict';

  angular
    .module('taskapplications')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('taskapplications', {
        abstract: true,
        url: '/taskapplications',
        template: '<ui-view/>'
      })
      .state('taskapplications.closed', {
        url: '/closed',
        templateUrl: 'modules/taskapplications/client/views/closed-taskapplication.client.view.html',
      })
      .state('taskapplications.submitted', {
        url: '/submitted/:name/:email',
        templateUrl: 'modules/taskapplications/client/views/submitted-taskapplication.client.view.html',
        controller: 'SubmittedController',
        controllerAs: 'vm',
      })
      .state('taskapplications.list', {
        url: '',
        templateUrl: 'modules/taskapplications/client/views/list-taskapplications.client.view.html',
        controller: 'TaskapplicationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taskapplications List'
        },
        resolve: {
          activeTaskgroupResolve : getActiveTaskgroup
        }
      })
      .state('taskapplications.create', {
        url: '/create/:taskgroupId',
        templateUrl: 'modules/taskapplications/client/views/form-taskapplication.client.view.html',
        controller: 'TaskapplicationsController',
        controllerAs: 'vm',
        resolve: {
          taskapplicationResolve: newTaskapplication,
          taskgroupResolve: getTaskgroup
        },
        data: {
          pageTitle : 'Taskapplications Create'
        }
      })
      .state('taskapplications.edit', {
        url: '/:taskapplicationId/:taskgroupId/edit',
        templateUrl: 'modules/taskapplications/client/views/form-taskapplication.client.view.html',
        controller: 'TaskapplicationsController',
        controllerAs: 'vm',
        resolve: {
          taskapplicationResolve: getTaskapplication,
          taskgroupResolve: getTaskgroup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Taskapplication {{ taskapplicationResolve.name }}'
        }
      })
      .state('taskapplications.view', {
        url: '/:taskapplicationId/:taskgroupId',
        templateUrl: 'modules/taskapplications/client/views/view-taskapplication.client.view.html',
        controller: 'TaskapplicationsController',
        controllerAs: 'vm',
        resolve: {
          taskapplicationResolve: getTaskapplication,
          taskgroupResolve: getTaskgroup
        },
        data:{
          pageTitle: 'Taskapplication {{ articleResolve.name }}'
        }
      })
      .state('taskapplications.gencompanyhosts', {
        url: '/generatecompanyhosts',
        templateUrl: 'modules/taskapplications/client/views/generate-companyhosts.client.view.html',
        controller: 'GenerateCompanyHostsController',
        controllerAs: 'vm',
        resolve: {
          companyListResolve: getCompanyList,
          taskapplicationsResolve: getTaskapplications
        }
      });
  }

  getCompanyList.$inject = ['$stateParams', 'CompaniesService'];

  function getCompanyList($stateParams, CompaniesService) {
    return CompaniesService.query().$promise;
  }

  getTaskapplications.$inject = ['$stateParams', 'TaskapplicationsService'];

  function getTaskapplications($stateParams, TaskapplicationsService){
    return TaskapplicationsService.query().$promise;
  }

  getActiveTaskgroup.$inject = ['$stateParams', '$http'];

  function getActiveTaskgroup($stateParams, $http) {
    return $http({
      method: 'GET',
      url: '/api/taskgroups/active'
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      console.log('ERROR: ' + response);
    });

  }

  getTaskgroup.$inject = ['$stateParams', 'TaskgroupsService'];

  function getTaskgroup($stateParams, TaskgroupsService) {
    return TaskgroupsService.get({
      taskgroupId: $stateParams.taskgroupId
    }).$promise;
  }

  getTaskapplication.$inject = ['$stateParams', 'TaskapplicationsService'];

  function getTaskapplication($stateParams, TaskapplicationsService) {
    return TaskapplicationsService.get({
      taskapplicationId: $stateParams.taskapplicationId
    }).$promise;
  }

  newTaskapplication.$inject = ['TaskapplicationsService'];

  function newTaskapplication(TaskapplicationsService) {
    return new TaskapplicationsService();
  }
})();
