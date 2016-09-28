/* global $:false */
(function () {
  'use strict';

  // Taskapplications controller
  angular
    .module('taskapplications')
    .controller('TaskapplicationsController', TaskapplicationsController);

  TaskapplicationsController.$inject = ['$scope', '$state', 'Authentication', 'taskapplicationResolve', '$stateParams', 'taskgroupResolve', 'Users', 'CompaniesService', '$timeout'];

  function TaskapplicationsController ($scope, $state, Authentication, taskapplication, $stateParams, taskgroupResolve, Users, CompaniesService, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = vm.authentication.user;
    vm.taskapplication = taskapplication;
    vm.createMode = !vm.taskapplication._id;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.taskgroup = taskgroupResolve;
    vm.cmphst = 'Company';
    vm.programs = [];


    vm.sizes = ['S','M','L','XL','XXL'];
    vm.taskapplication.tshirtsize = 'S';

    // Update view with Model
    $scope.tshirtsize = 'S';
    $scope.driverLicense = vm.taskapplication.driverLicense ? 'yes' : 'no';
    $scope.attendGasque = vm.taskapplication.attendGasque ? 'yes' : 'no';
    $scope.attendKickoff = vm.taskapplication.attendKickoff ? 'yes' : 'no';


    // Create sorting function for companies.
    function compare(a,b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    }

    CompaniesService.query(function (response) {
      vm.companies = response;
      vm.companies.sort(compare);
      vm.displayCompanies = vm.companies;
      // Get unique programs.
      vm.companies.forEach(function(c) {
        c.desiredProgramme.forEach(function (dp){
          if(vm.programs.indexOf(dp) === -1){
            vm.programs.push(dp);
          }
        });
      });
      // Angular needs to complete rendering before applying 'chosen'
      $timeout(function () {
        // Chosen methods
        $('.my_select_box').chosen({
          no_results_text: 'Oops, nothing found!',
          width: '100%'
        });
        $('.company_select_box').chosen({
          no_results_text: 'Oops, nothing found!',
          max_selected_options: 5,
          placeholder_text_multiple: 'Fyll i 5 företag / Apply 5 companies',
          width: '100%'
        });
      }, 0, false);

    });

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

    $('.size_select_box').chosen({
      no_results_text: 'Oops, nothing found!',
      width: '100%'
    });
    $('.size_select_box').on('change', function(evt, params) {
      vm.taskapplication.tshirtsize = params.selected;
    });
    $('.my_select_box').on('change', function(evt, params) {
      vm.myProgram = vm.programs[params.selected];
      updateCompanyList();
      $scope.$apply();
    });
    vm.chosenCompanies = [];
    $('.company_select_box').on('change', function(evt, params) {
      var element = $('.company_select_box');
      if(params.selected){
        vm.chosenCompanies.push(vm.companies[params.selected]);
      } else if(params.deselected) {
        var position = vm.chosenCompanies.indexOf(vm.companies[params.deselected]);
        vm.chosenCompanies.splice(position, 1);
      }
      console.log(vm.chosenCompanies);
    });


    vm.filter = false;
    $scope.toggleFilter = function () {
      vm.filter = !vm.filter;
      updateCompanyList();
    };

    function updateCompanyList() {
      vm.displayCompanies = [];
      vm.companies.forEach(function (c) {
        if(!vm.filter || c.desiredProgramme.indexOf(vm.myProgram) >= 0){
          vm.displayCompanies.push(c);
        }
      });
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

    // Returns the chosen companies on the form saved in the database
    function chosenCompaniesDBFormat() {
      var dbFormatted = [];

      for(var i = 0; i < vm.chosenCompanies.length; i++) {
        dbFormatted.push({ name: vm.chosenCompanies[i].name, order: i + 1 });
      }

      return dbFormatted;
    }

    // Save Taskapplication
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskapplicationForm');
        vm.error = 'Ett fält är inte ifyllt / A field is missing';
        return false;
      }
      vm.error = '';

      // Update taskapplication name value;
      vm.taskapplication.name = vm.firstname + ' ' + vm.lastname;
      vm.taskapplication.choices = [{ order: 1, choice: vm.firstchoice }, { order: 2, choice: vm.secondchoice }, { order: 3, choice: vm.thirdchoice }];
      vm.taskapplication.chosenCompanies = chosenCompaniesDBFormat();
      vm.taskapplication.program = vm.myProgram;
      vm.taskapplication.driverLicense = $scope.driverLicense === 'yes';
      vm.taskapplication.attendGasque = $scope.attendGasque === 'yes';
      vm.taskapplication.attendKickoff = $scope.attendKickoff === 'yes';

      // TODO: move create/update logic to service
      if (vm.taskapplication._id) {
        vm.taskapplication.$update(successCallbackApplication, errorCallback);
      } else {
        vm.taskapplication.$save(successCallbackApplication, errorCallback);
      }

      function successCallbackUser(res) {
        if(vm.createMode){
          $state.go('taskapplications.submitted', { name: vm.taskapplication.name, email: vm.taskapplication.email });
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
        if(vm.user){
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
        } else {
          successCallbackUser();
        }
      }
    }
  }
})();
