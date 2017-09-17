/* global $:false */
(function () {
  'use strict';

  // Taskapplications controller
  angular
    .module('taskapplications')
    .controller('TaskapplicationsController', TaskapplicationsController);

  TaskapplicationsController.$inject = ['$scope', '$state', 'Authentication', 'taskapplicationResolve', '$stateParams', 'taskgroupResolve', 'Users', 'CompaniesService', '$timeout', 'ProgramsService'];

  function TaskapplicationsController ($scope, $state, Authentication, taskapplication, $stateParams, taskgroupResolve, Users, CompaniesService, $timeout, ProgramsService) {
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
    
    if(!vm.user) {
	$state.go('authentication.signin').then(function(){
	    storePreviousState(toState, toParams);
	});
    }
    vm.authentication = Authentication;
    vm.user = vm.authentication.user;
    vm.isAdmin = vm.user.roles && vm.user.roles.indexOf("admin") >= 0;

	  //vm.applicationPeriodClosed = !vm.isAdmin;
    //if(vm.applicationPeriodClosed){
    //  $state.go('taskapplications.closed');
    //}



    vm.sizes = ['S','M','L','XL','XXL'];
    vm.avail = ['Alltid/Always', 'Delvis/Partially'];
    vm.heardvia = ['Facebook', 'Nyhetsbrev/Newsletter', 'Genom en kompis/From a friend', 'Arkad event', 'Kårkampen', 'Kårestivalen', 'Nollelördagen', 'Nollesöndagen', 'Annat/Other'];
    vm.taskapplication.tshirtsize = 'S';
    vm.taskapplication.availability = 'Delvis/Partially'
    vm.taskapplication.heardvia = 'Facebook'

    // Update view with Model
    $scope.tshirtsize = 'S';
    $scope.avail = 'Delvis/Partially';
    $scope.heardvia = 'Facebook';

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

    // Get unique programs.
    var programsSet = new Set(ProgramsService);
    vm.programs = [];
    programsSet.forEach(function(v){ vm.programs.push(v); });

    CompaniesService.query(function (response) {
      vm.companies = response;
      vm.companies.sort(compare);
      vm.displayCompanies = vm.companies;
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
      vm.taskapplication.user = vm.user._id;
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
      $('.my_select_box').trigger('chosen:updated');
    });
    $('.avail_select_box').chosen({
      no_results_text: 'Oops, nothing found!',
      width: '100%'
    });
    $('.avail_select_box').on('change', function(evt, params) {
      vm.taskapplication.availability = params.selected;
    });
    $('.heardvia_select_box').chosen({
      no_results_text: 'Oops, nothing found!',
      width: '100%'
    });
    $('.heardvia_select_box').on('change', function(evt, params) {
      vm.taskapplication.heardvia = params.selected;
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
