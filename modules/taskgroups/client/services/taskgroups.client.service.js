//Taskgroups service used to communicate Taskgroups REST endpoints
(function () {
  'use strict';

  angular
    .module('taskgroups')
    .factory('TaskgroupsService', TaskgroupsService);

  TaskgroupsService.$inject = ['$resource'];

  function TaskgroupsService($resource) {
    return $resource('api/taskgroups/:taskgroupId', {
      taskgroupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
