/*global $:false */
(function () {
  'use strict';

  angular
    .module('taskapplications')
    .controller('TaskapplicationsListController', TaskapplicationsListController);

  TaskapplicationsListController.$inject = ['$scope' ,'TaskapplicationsService', '$filter'];

  function TaskapplicationsListController($scope, TaskapplicationsService, $filter) {
    var vm = this;

    TaskapplicationsService.query(function(data) {
      vm.taskapplications = data;
      angular.forEach(vm.taskapplications, function(application, key) {
        application.nr = 1 + key;
        application.date = $filter('date')(application.created, "yyyy-MM-dd");
        application.choice1 = application.choices[0].choice || '';
        application.choice2 = application.choices[1].choice || '';
        application.choice3 = application.choices[2].choice || '';
      });
      // Datatable code
      // Setup - add a text input to each footer cell
      $('#applicationsList tfoot th:not(:first)').each(function () {
        var title = $(this).text();
        $(this).html('<input class="form-control" type="text" placeholder="Search '+title+'" />');
      });  

      var table = $('#applicationsList').DataTable({
        dom: 'Bfrtip',
        scrollX: true,
        scrollCollapse: true,
        autoWidth: false,
        paging: false,
        stateSave: true,
        buttons: [
          'copy', 'excel', 'pdf', 'colvis'
        ],
        data: data,
        'order': [[ 1, 'asc' ]],
        columns: [
          { data: 'nr' },
          { data: 'date' },
          { data: 'name',
            'fnCreatedCell': function (nTd, sData, oData, iRow, iCol) {
              $(nTd).html('<a href="/taskapplications/'+oData._id+'/'+oData.taskgroup+'">'+sData+'</a>');
            }
          },
          { data: 'program' },
          { data: 'year' },
          { data: 'point' },
          { data: 'choice1' },
          { data: 'choice2' },
          { data: 'choice3' },
          { data: 'attendGasque' },
          { data: 'attendKickoff' },
          { data: 'driverLicense' },
          { data: 'email' },
          { data: 'phone' },
          { data: 'tshirtsize' },
          { data: 'assignedTask' }
        ]
      });
            
      // Apply the search
      table.columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
          if (that.search() !== this.value) {
            that.search(this.value).draw();
          }
        });
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
