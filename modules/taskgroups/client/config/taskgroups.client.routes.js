(function () {
  'use strict';

  angular
    .module('taskgroups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('taskgroups', {
        abstract: true,
        url: '/taskgroups',
        template: '<ui-view/>'
      })
      .state('taskgroups.list', {
        url: '',
        templateUrl: 'modules/taskgroups/client/views/list-taskgroups.client.view.html',
        controller: 'TaskgroupsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taskgroups List'
        }
      })
      .state('taskgroups.create', {
        url: '/create',
        templateUrl: 'modules/taskgroups/client/views/form-taskgroup.client.view.html',
        controller: 'TaskgroupsController',
        controllerAs: 'vm',
        resolve: {
          taskgroupResolve: newTaskgroup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Taskgroups Create'
        }
      })
      .state('taskgroups.active', {
        url: '/active',
        templateUrl: 'modules/taskgroups/client/views/active-taskgroup.client.view.html',
        controller: 'ActiveTaskgroupsController',
        controllerAs: 'vm',
        resolve: {
          taskgroupListResolve: getTaskgroupList
        }
      })
      .state('taskgroups.edit', {
        url: '/:taskgroupId/edit',
        templateUrl: 'modules/taskgroups/client/views/form-taskgroup.client.view.html',
        controller: 'TaskgroupsController',
        controllerAs: 'vm',
        resolve: {
          taskgroupResolve: getTaskgroup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Taskgroup {{ taskgroupResolve.name }}'
        }
      })
      .state('taskgroups.view', {
        url: '/:taskgroupId',
        templateUrl: 'modules/taskgroups/client/views/view-taskgroup.client.view.html',
        controller: 'TaskgroupsController',
        controllerAs: 'vm',
        resolve: {
          taskgroupResolve: getTaskgroup
        },
        data:{
          pageTitle: 'Taskgroup {{ articleResolve.name }}'
        }
      });
  }


  getTaskgroupList.$inject = ['$stateParams', 'TaskgroupsService'];

  function getTaskgroupList($stateParams, TaskgroupsService) {
    return TaskgroupsService.query().$promise;
  }

  getTaskgroup.$inject = ['$stateParams', 'TaskgroupsService'];

  function getTaskgroup($stateParams, TaskgroupsService) {
    return TaskgroupsService.get({
      taskgroupId: $stateParams.taskgroupId
    }).$promise;
  }

  newTaskgroup.$inject = ['TaskgroupsService'];

  function newTaskgroup(TaskgroupsService) {
    return new TaskgroupsService();
  }
})();
