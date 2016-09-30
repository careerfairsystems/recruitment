/* global $:false */
(function () {
  'use strict';

  // Companies controller
  angular
    .module('companies')
    .controller('CompaniesController', CompaniesController);

  CompaniesController.$inject = ['$scope', '$state', 'Authentication', 'companyResolve', '$timeout'];

  function CompaniesController ($scope, $state, Authentication, company, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.company = company;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.chosenPrograms = vm.company.desiredProgramme || [];

    vm.programs = ['Byggteknik med arkitektur / Civil Engineering - Architecture',
                'Arkitekt / Architect',
                'Medicin och teknik / Biomedical Engineering',
                'Bioteknik / Biotechnology',                  
                'Kemiteknik / Chemical Engineering',
                'Brandingenjörsutbildning / Fire Protection Engineering',
                'Byggteknik med järnvägsteknik / Civil Engineering - Railway Construction',
                'Civil Engineering- Road and Traffic Technology / Civil Engineering- Road and Traffic Technology',
                'Väg- och vattenbyggnad / Civil Engineering',
                'Datateknik / Computer Science and Engineering',
                'Informations- och kommunikationsteknik / Information and Communication Engineering',
                'Ekosystemteknik / Environmental Engineering',
                'Elektroteknik / Electrical Engineering',
                'Teknisk Matematik / Engineering Mathematics',
                'Teknisk Nanovetenskap / Engineering Nanoscience',
                'Teknisk Fysik / Engineering Physics',
                'Teknisk Matematik / Engineering Mathematics',
                'Teknisk Fysik / Engineering Physics',
                'Teknisk Nanovetenskap / Engineering Nanoscience',
                'Ekosystemteknik / Environmental Engineering',
                'Industridesign / Industrial Design',
                'Industriell ekonomi / Industrial Engineering and Management',
                'Industridesign / Industrial Design',
                'Lantmäteri / Surveying',
                'Maskinteknik med teknisk design / Mechanical Engineering with Industrial Design',
                'Maskinteknik / Mechanical Engineering',
                'Lantmäteri / Surveying'];

    $timeout(function () {
      $('.my_select_box').chosen({
        no_results_text: 'Oops, nothing found!',
        width: '100%'
      });
      $('.my_select_box').on('change', function(evt, params) {
        if(params.selected){
          vm.chosenPrograms.push(vm.programs[params.selected]);
        } else if(params.deselected) {
          var position = vm.chosenPrograms.indexOf(vm.programs[params.deselected]);
          vm.chosenPrograms.splice(position, 1);
        }
        console.log(vm.chosenPrograms);
      });
    }, 0, false);
    $scope.addDesiredProgramme = function (dp) {
      vm.company.desiredProgramme.push(dp);
      vm.newDp = '';
    };
    
    $scope.deleteDesiredProgramme = function (index) {
      if(index >= 0){
        vm.company.desiredProgramme.splice(index, 1);
      }
    };


    // Remove existing Company
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.company.$remove($state.go('companies.list'));
      }
    }

    // Save Company
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }
      vm.company.desiredProgramme = vm.chosenPrograms;

      // TODO: move create/update logic to service
      if (vm.company._id) {
        vm.company.$update(successCallback, errorCallback);
      } else {
        vm.company.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('companies.view', {
          companyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
