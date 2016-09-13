/*global $:false */
(function () {
  'use strict';

  angular
    .module('taskapplications')
    .controller('TaskapplicationsListController', TaskapplicationsListController);

  TaskapplicationsListController.$inject = ['$scope' ,'TaskapplicationsService'];

  function TaskapplicationsListController($scope, TaskapplicationsService) {
    var vm = this;

    TaskapplicationsService.query(function(data) {
      vm.taskapplications = data;
      console.log(data[0]);
      angular.forEach(vm.taskapplications, function(application) {
        application.choice1 = application.choices[0].choice || '';
        application.choice2 = application.choices[1].choice || '';
        application.choice3 = application.choices[2].choice || '';
      });
      // Datatable code
      $('#applicationsList').DataTable({
        dom: 'Bfrtip',
        "scrollY": 300,
        "scrollX": true,
        stateSave: true,
        buttons: [
        'copy', 'excel', 'pdf', 'colvis'
        ],
        data: data,
        columns: [
        { data: 'name', title: "Name" },
        { data: 'program', title: "Program" },
        { data: 'year', title: "Year" },
        { data: 'point', title: "Points" },
        { data: 'choice1', title: "First choice" },
        { data: 'choice2', title: "Second choice" },
        { data: 'choice3', title: "Third choice" },
        { data: 'attendGasque', title: "Attend Gasque" },
        { data: 'attendKickoff', title: "Attend Kickoff" },
        { data: 'driverLicense', title: "DriverLicense" },
        { data: 'email', title: "Email" },
        { data: 'phone', title: "Phone" },
        { data: 'tshirtsize', title: "Tshirtsize" },
        { data: 'assignedTask', title: "Assigned Task" }
      ]
      });
    });

    
    // For exporting to excel
    $scope.datafields = {
      'name': 'Name',
      'program': 'Program',
      'email': 'Email',
      'phone': 'Phone',
      'foodpref': 'Food preference',
      'motivation': 'Motivation',
      'choice1': 'First Choice',
      'choice2': 'Second Choice',
      'choice3': 'Third Choice'
    };

  }
})();
