(function () {
  'use strict';

  angular
    .module('taskgroups')
    .controller('TaskgroupsListController', TaskgroupsListController);

  TaskgroupsListController.$inject = ['TaskgroupsService'];

  function TaskgroupsListController(TaskgroupsService) {
    var vm = this;

    vm.taskgroups = TaskgroupsService.query();
  }
})();
