/* global $:false */
(function () {
  'use strict';

  // Taskapplications controller
  angular
    .module('taskapplications')
    .controller('GenerateCompanyHostsController', GenerateCompanyHostsController);

  GenerateCompanyHostsController.$inject = ['$scope', '$state', 'companyListResolve', 'taskapplicationsResolve'];

  function GenerateCompanyHostsController ($scope, $state, companyListResolve, taskapplicationsResolve) {
    var vm = this;




  }
})();
