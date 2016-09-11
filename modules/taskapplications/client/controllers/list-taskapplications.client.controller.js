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
      angular.forEach(vm.taskapplications, function(application) {
        application.choice1 = application.choices[0].choice;
        application.choice2 = application.choices[1].choice;
        application.choice3 = application.choices[2].choice;
      });
    });

    // Datatable code
    var dataSet = [
      [ 'Tiger Nixon', 'System Architect', 'Edinburgh', '5421', '2011/04/25', '$320,800' ],
      [ 'Garrett Winters', 'Accountant', 'Tokyo', '8422', '2011/07/25', '$170,750' ],
      [ 'Rhona Davidson', 'Integration Specialist', 'Tokyo', '6200', '2010/10/14', '$327,900' ]
    ];
    $('#applicationsList').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'excel', 'pdf'
      ],
      data: dataSet,
      columns: [
    { title: 'Name' },
      { title: 'Position' },
      { title: 'Office' },
      { title: 'Extn.' },
      { title: 'Start date' },
      { title: 'Salary' }
      ]
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
