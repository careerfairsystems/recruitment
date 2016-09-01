//Taskapplications service used to communicate Taskapplications REST endpoints
(function () {
  'use strict';

  angular
    .module('taskapplications')
    .factory('TaskapplicationsService', TaskapplicationsService);

  TaskapplicationsService.$inject = ['$resource'];

  function TaskapplicationsService($resource) {
    return $resource('api/taskapplications/:taskapplicationId', {
      taskapplicationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
