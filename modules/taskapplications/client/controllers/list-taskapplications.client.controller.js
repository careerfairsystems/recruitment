(function () {
  'use strict';

  angular
    .module('taskapplications')
    .controller('TaskapplicationsListController', TaskapplicationsListController);

  TaskapplicationsListController.$inject = ['TaskapplicationsService'];

  function TaskapplicationsListController(TaskapplicationsService) {
    var vm = this;

    vm.taskapplications = TaskapplicationsService.query();
  }
})();
