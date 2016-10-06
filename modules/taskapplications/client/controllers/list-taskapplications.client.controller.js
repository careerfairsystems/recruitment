/*global $:false */
(function () {
  'use strict';

  angular
    .module('taskapplications')
    .controller('TaskapplicationsListController', TaskapplicationsListController);

  TaskapplicationsListController.$inject = ['$http', '$scope' ,'TaskapplicationsService', '$filter', '$compile', '$timeout', 'activeTaskgroupResolve', 'CompaniesService'];

  function TaskapplicationsListController($http, $scope, TaskapplicationsService, $filter, $compile, $timeout, activeTaskgroupResolve, CompaniesService) {
    var vm = this;
    vm.activeTaskgroup = activeTaskgroupResolve;

    vm.task = "";
    vm.company = "";
    vm.tasks = [];
    vm.tasks.push("Not assigned");
    for(var i = 0; i < vm.activeTaskgroup.tasks.length; i++) {
      vm.tasks.push(vm.activeTaskgroup.tasks[i].name);
    }
    //get Task
    vm.companies = [];
    CompaniesService.query(function (result){
      result.sort(function (a,b) {
        return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
      });
      vm.companies = ["Not assigned"];
      result.forEach(function (c){
        vm.companies.push(c.name);
      });
      $timeout(function () {
          // Chosen methods
        $(".task_select_box").chosen({
          no_results_text: "Oops, nothing found!",
          max_selected_options: 5,
          width: "100%"
        });
        $(".company_assigned_select_box").chosen({
          no_results_text: "Oops, nothing found!",
          max_selected_options: 5,
          width: "100%"
        });
        $('.task_select_box').on('change', function(evt, params) {
          if(params.selected){
            $scope.current.assignedTask = vm.tasks[params.selected];
          } else if(params.deselected) {
            $scope.current.assignedTask = {};
          }
          $scope.$apply();
        });
        $('.company_assigned_select_box').on('change', function(evt, params) {
          if(params.selected) {
            $scope.current.assignedCompany = vm.companies[params.selected];
          } else if(params.deselected) {
            $scope.current.assignedCompany = "";
          }
          $scope.$apply();
        });
      }, 0, false);
    });

    // Modal
    vm.current = {};
    vm.currentIndex = -1;
    var modal = document.getElementById('myModal');
    var btn = document.getElementById('myBtn');
    var closeBtn = document.getElementsByClassName('close')[0];
    vm.openApplication = function(index) {
      vm.currentIndex = index;
      $scope.current = vm.taskapplications[index];

      console.log("Point:" + $scope.current.point);
      vm.task = $scope.current.assignedTask || 'Not assigned';
      vm.company = $scope.current.assignedCompany || 'Not assigned';
      $('.task_select_box').val($('option[label="' + vm.task + '"]').attr('value'));
      $('.company_assigned_select_box').val($('option[label="' + vm.company + '"]').attr('value'));
      $('.task_select_box').trigger("chosen:updated");
      $('.company_assigned_select_box').trigger("chosen:updated");
      modal.style.display = 'block';
    };
    closeBtn.onclick = function() {
      vm.closeModal();
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === modal) {
        vm.closeModal();
      }
    };
    vm.closeModal = function() {
      modal.style.display = 'none';
      // Deselect choice 
      $('.task_select_box')
        .find('option:first-child').prop('selected', true)
        .end().trigger('chosen:updated');
      $('.company_assigned_select_box')
        .find('option:first-child').prop('selected', true)
        .end().trigger('chosen:updated');
      $('.task_select_box').val(0);
      $('.task_select_box').trigger("chosen:updated");
      $('.company_assigned_select_box').val(0);
      $('.company_assigned_select_box').trigger("chosen:updated");
      vm.currentIndex = -1;
    };
    vm.updateApplication = function(){
      // Update DB.
      TaskapplicationsService.update(vm.taskapplications[vm.currentIndex], function (response) {
        //success function
        alert("Save successfull");
      }, function (response) {
        //error function
        alert("Save NOT successfull.");
      });
      // Recreate datatable
      vm.table.destroy();
      vm.createDatatable(vm.taskapplications);
      // Hide modal
      vm.closeModal();
    };

    TaskapplicationsService.query(function(data) {
      vm.taskapplications = data;
      angular.forEach(vm.taskapplications, function(application, key) {
        application.nr = 1 + key;
        application.date = $filter('date')(application.created, 'yyyy-MM-dd');
        application.choice1 = application.choices[0].choice || '';
        application.choice2 = application.choices[1].choice || '';
        application.choice3 = application.choices[2].choice || '';
        application.assignedCompany = application.assignedCompany || '';
        if(application.chosenCompanies && application.chosenCompanies.length > 0){
          application.companies = application.chosenCompanies.reduce(function(previousValue, currentValue, currentIndex) {
            if(currentIndex === 0) {
              return currentValue.name;
            }
            return previousValue + ', ' + currentValue.name;
          }, '');
        } else {
          application.companies = '';
        }
      });
      // Datatable code
      // Setup - add a text input to each footer cell
      $('#applicationsList thead tr:first th:not(:first)').each(function (index) {
        var title = $(this).text();
        var pos = index + 1;
        $(this).html('<input class="form-control" id="col-search-'+pos+'" type="text" placeholder="Search '+title+'" />');
      });

      vm.createDatatable(data);
    });

    vm.createDatatable = function(data){
      vm.table = $('#applicationsList').DataTable({
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
              $(nTd).html('<button class="btn-link" data-ng-click="vm.openApplication('+ iRow+')">'+sData+'</button>');
              // VIKTIG: för att ng-click ska kompileras och finnas.
              $compile(nTd)($scope);
            }
          },
          { data: 'point' },
          { data: 'assignedTask' },
          { data: 'assignedCompany' },
          { data: 'program' },
          { data: 'year' },
          { data: 'choice1' },
          { data: 'choice2' },
          { data: 'choice3' },
          { data: 'companies' },
          { data: 'driverLicense' },
          { data: 'attendGasque' },
          { data: 'attendKickoff' },
          { data: 'email' },
          { data: 'phone' },
          { data: 'tshirtsize' },
          { data: 'foodpref' },
        ]
      });

      // Apply the search
      vm.table.columns().every(function (index) {
        var that = this;
        $('input#col-search-'+index).on('keyup change', function () {
          if (that.search() !== this.value) {
            that.search(this.value).draw();
          }
        });
      });
    };

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
