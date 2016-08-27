(function () {
  'use strict';

  // Taskgroups controller
  angular
    .module('taskgroups')
    .controller('TaskgroupsController', TaskgroupsController);

  TaskgroupsController.$inject = ['$scope', '$state', 'Authentication', 'taskgroupResolve', '$sce'];

  function TaskgroupsController ($scope, $state, Authentication, taskgroup, $sce) {
    var vm = this;

    vm.authentication = Authentication;
    vm.taskgroup = taskgroup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if(!vm.taskgroup.tasks){
      vm.taskgroup.tasks = [];
    }

    // To show description in HTML.
    $scope.htmlDescription = $sce.trustAsHtml(vm.taskgroup.description);

    $scope.addTask = function (tasks) {
      tasks.push({ name: '', quantity: 1, description: '', edit: true });
    };

    $scope.saveTask = function (index) {
      vm.taskgroup.tasks[index].edit = false;
    };
    $scope.deleteTask = function (index) {
      vm.taskgroup.tasks[index].splice(index, 1);
    };


    // Remove existing Taskgroup
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.taskgroup.$remove($state.go('taskgroups.list'));
      }
    }

    // Save Taskgroup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskgroupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.taskgroup._id) {
        vm.taskgroup.$update(successCallback, errorCallback);
      } else {
        vm.taskgroup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('taskgroups.view', {
          taskgroupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
