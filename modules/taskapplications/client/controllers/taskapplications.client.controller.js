(function () {
  'use strict';

  // Taskapplications controller
  angular
    .module('taskapplications')
    .controller('TaskapplicationsController', TaskapplicationsController);

  TaskapplicationsController.$inject = ['$scope', '$state', 'Authentication', 'taskapplicationResolve'];

  function TaskapplicationsController ($scope, $state, Authentication, taskapplication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.taskapplication = taskapplication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Taskapplication
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.taskapplication.$remove($state.go('taskapplications.list'));
      }
    }

    // Save Taskapplication
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskapplicationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.taskapplication._id) {
        vm.taskapplication.$update(successCallback, errorCallback);
      } else {
        vm.taskapplication.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('taskapplications.view', {
          taskapplicationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
