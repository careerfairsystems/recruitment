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
        url: '/create',
        templateUrl: 'modules/taskapplications/client/views/form-taskapplication.client.view.html',
        controller: 'TaskapplicationsController',
        controllerAs: 'vm',
        resolve: {
          taskapplicationResolve: newTaskapplication
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Taskapplications Create'
        }
      })
      .state('taskapplications.edit', {
        url: '/:taskapplicationId/edit',
        templateUrl: 'modules/taskapplications/client/views/form-taskapplication.client.view.html',
        controller: 'TaskapplicationsController',
        controllerAs: 'vm',
        resolve: {
          taskapplicationResolve: getTaskapplication
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Taskapplication {{ taskapplicationResolve.name }}'
        }
      })
      .state('taskapplications.view', {
        url: '/:taskapplicationId',
        templateUrl: 'modules/taskapplications/client/views/view-taskapplication.client.view.html',
        controller: 'TaskapplicationsController',
        controllerAs: 'vm',
        resolve: {
          taskapplicationResolve: getTaskapplication
        },
        data:{
          pageTitle: 'Taskapplication {{ articleResolve.name }}'
        }
      });
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
