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
      .state('taskapplications.submitted', {
        url: '/submitted/:name/:email',
        templateUrl: 'modules/taskapplications/client/views/submitted-taskapplication.client.view.html',
        controller: 'SubmittedController',
        controllerAs: 'vm',
      })
      .state('taskapplications.mylist', {
        url: '/mylist',
        templateUrl: 'modules/taskapplications/client/views/list-taskapplications.client.view.html',
        controller: 'MyTaskapplicationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taskapplications List'
        }
      })
      .state('taskapplications.list', {
        url: '',
        templateUrl: 'modules/taskapplications/client/views/list-taskapplications.client.view.html',
        controller: 'TaskapplicationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taskapplications List'
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
