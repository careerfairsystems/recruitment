/* global $:false */
(function () {
  'use strict';

  // Taskapplications controller
  angular
    .module('taskapplications')
    .controller('GenerateCompanyHostsController', GenerateCompanyHostsController);

  GenerateCompanyHostsController.$inject = ['$scope', '$state', 'companyListResolve', 'taskapplicationsResolve', 'TaskapplicationsService'];

  function GenerateCompanyHostsController ($scope, $state, companyListResolve, taskapplicationsResolve, TaskapplicationsService) {
    var vm = this;

    vm.companies = companyListResolve;
    vm.taskapplications = taskapplicationsResolve;


    vm.assignedHosts = [];
    
    vm.assignCompanies = function (){
      // Shuffle a list
      function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
        }
      }

      // Filter taskapplications for assignedtask company host
      function isCompanyHost(application) {
        return application.assignedTask.toLowerCase().indexOf('company') >= 0;
      }
      function hasChosenCompanies(application) {
        return application.chosenCompanies.length > 0;
      }
      shuffle(vm.taskapplications);
      vm.companyHosts = vm.taskapplications.filter(isCompanyHost);


      // Assign random points, Remove when production.
      function assignPoint(a){
        a.point = Math.floor(Math.random() * 200);
      }
      //vm.companyHosts.forEach(assignPoint);

      // Sort taskapplications after points.
      function hasHighestPoints (a, b){
        return a.point < b.point ? 1 : -1;
      }
      vm.companyHosts = vm.companyHosts.sort(hasHighestPoints);

      // Remove overflowing applications.
      vm.companyHosts = vm.companyHosts.splice(0, vm.companies.length);

      // Assign a company from choices
      var takenCompanies = [];
      vm.companyHosts.forEach(function(a){
        var comp = a.chosenCompanies.sort(function(c1, c2){
          return c1.order > c2.order ? 1 : -1;
        });


        comp.forEach(function(c){
          if(!a.assignedCompany && takenCompanies.indexOf(c.name) < 0){
            a.assignedCompany = c.name;
            vm.assignedHosts.push(a);
            takenCompanies.push(c.name);
          }
        });
      });

      function notAssignedCompany(a){
        return !a.assignedCompany;
      }
      vm.rest = vm.companyHosts.filter(notAssignedCompany);
      vm.rest = vm.rest.sort(hasHighestPoints);

      shuffle(vm.companies);

      // Get map of companies from education.
      var eduComps = {};
      vm.companies.forEach(function (c){
        if(takenCompanies.indexOf(c.name) < 0){
          var dP = new Set(c.desiredProgramme);
          dP.forEach(function (p){
            if(!eduComps[p]){
              eduComps[p] = [];
            }
            eduComps[p].push(c.name);
          });
        }
      });


      // Assign a company from education
      vm.rest.forEach(function(a){
        eduComps[a.program].forEach(function(pro){
          if(!a.assignedCompany && takenCompanies.indexOf(pro) < 0){ 
            a.assignedCompany = pro;
            vm.assignedHosts.push(a);
            takenCompanies.push(pro);
          } 
        });
      });

      var lastCompanies = vm.companies.filter(function(c){
        return takenCompanies.indexOf(c.name) < 0;
      });

      vm.rest = vm.rest.filter(notAssignedCompany);

      shuffle(lastCompanies);

      vm.rest.forEach(function (a, pos){
        a.assignedCompany = lastCompanies[pos].name;
        vm.assignedHosts.push(a);
        takenCompanies.push(lastCompanies[pos].name);
      });

      vm.updateToDatabase(vm.assignedHosts);

    };

    vm.removeAssignments = function () {
      vm.taskapplications.forEach(function (t){
        t.assignedCompany = '';
      }); 
      vm.updateToDatabase(vm.taskapplications);
    };

    vm.updateToDatabase = function (list) {
      list.forEach(function (a){
        TaskapplicationsService.update(a);
      });
    };








  }
})();
