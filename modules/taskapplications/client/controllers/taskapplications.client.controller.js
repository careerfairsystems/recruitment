(function () {
  'use strict';

  // Taskapplications controller
  angular
    .module('taskapplications')
    .controller('TaskapplicationsController', TaskapplicationsController);

  TaskapplicationsController.$inject = ['$scope', '$state', 'Authentication', 'taskapplicationResolve', '$stateParams', 'taskgroupResolve', 'Users', 'CompaniesService'];

  function TaskapplicationsController ($scope, $state, Authentication, taskapplication, $stateParams, taskgroupResolve, Users, CompaniesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = vm.authentication.user;
    vm.taskapplication = taskapplication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.taskgroup = taskgroupResolve;
    vm.cmphst = "Company Hosts";
    vm.companies = CompaniesService.query();
    
    // Update values
    if (!vm.taskapplication._id) {
      vm.taskapplication.taskgroup = vm.taskgroup._id;
      vm.firstname = vm.user.firstName;
      vm.lastname = vm.user.lastName;
      vm.taskapplication.program = vm.user.program;
      vm.taskapplication.email = vm.user.email;
      vm.taskapplication.phone = vm.user.phone;
      vm.taskapplication.foodpref = vm.user.foodpref;
    } else {
      vm.firstname = vm.taskapplication.name.split(' ')[0];
      vm.lastname = vm.taskapplication.name.split(' ')[1];
      vm.firstchoice = vm.taskapplication.choices[0].choice;
      vm.secondchoice = vm.taskapplication.choices[1].choice;
      vm.thirdchoice = vm.taskapplication.choices[2].choice;
    }
    
    $scope.goBack = function(){
      if(!vm.taskapplication._id){
        $state.go('taskapplications.view', { taskapplicationId: vm.taskapplication._id, taskgroupId: vm.taskapplication.taskgroup });
      }
    };

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

      // Update taskapplication name value;
      vm.taskapplication.name = vm.firstname + ' ' + vm.lastname;
      vm.taskapplication.choices = [{ order: 1, choice: vm.firstchoice }, { order: 2, choice: vm.secondchoice }, { order: 3, choice: vm.thirdchoice }];
  
      // TODO: move create/update logic to service
      if (vm.taskapplication._id) {
        vm.taskapplication.$update(successCallbackApplication, errorCallback);
      } else {
        vm.taskapplication.$save(successCallbackApplication, errorCallback);
      }

      function successCallbackUser(res) {
        if(!vm.taskapplication._id){
          $state.go('taskapplications.submitted');
        } else {
          $state.go('taskapplications.view', { taskapplicationId: vm.taskapplication._id, taskgroupId: vm.taskapplication.taskgroup });
        }
      }
      function successCallbackApplication(res) {
        updateUserProfile();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

      // Update user with saved applicationinformation
      function updateUserProfile(){
        // Update user data.
        vm.user.firstName = vm.firstname;
        vm.user.lastName = vm.lastname;
        vm.user.displayName = vm.firstname + ' ' + vm.lastname;
        vm.user.program = vm.taskapplication.program;
        vm.user.email = vm.taskapplication.email;
        vm.user.phone = vm.taskapplication.phone;
        vm.user.foodpref = vm.taskapplication.foodpref;

        var myUser = new Users(vm.user);
        myUser.$update(successCallbackUser, errorCallback);
      }
    }
  }
})();
