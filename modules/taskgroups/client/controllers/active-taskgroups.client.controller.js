(function () {
  'use strict';

  angular
    .module('taskgroups')
    .controller('ActiveTaskgroupsController', ActiveTaskgroupsController);

  ActiveTaskgroupsController.$inject = ['TaskgroupsService', 'taskgroupListResolve', '$scope', '$location', '$anchorScroll'];

  function ActiveTaskgroupsController(TaskgroupsService, taskgroups, $scope, $location, $anchorScroll) {
    var vm = this;
    vm.taskgroups = taskgroups;

    $scope.gotoSelected = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('taskgroup');

      // call $anchorScroll()
      $anchorScroll();
    };

    $scope.viewTaskgroup = function(taskgroup) {
      $scope.taskgroup = taskgroup; // Setting is the selected one.
      $scope.gotoSelected();
    };

    $scope.setActive = function(taskgroup) {
			taskgroup.active = !taskgroup.active ? true : false;
			TaskgroupsService.update(taskgroup);
			if(taskgroup.active) {
				angular.forEach(taskgroups, function(tg) {
      	  if(!(taskgroup.name === tg.name)) {
      	    tg.active = false;
      	    TaskgroupsService.update(tg);
      	  }
      	});
			}
    };
  }
})();
