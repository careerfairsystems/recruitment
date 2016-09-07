(function () {
  'use strict';

  angular
    .module('taskapplications')
    .controller('MyTaskapplicationsListController', MyTaskapplicationsListController);

  MyTaskapplicationsListController.$inject = ['$http', 'Authentication'];

  function MyTaskapplicationsListController($http, Authentication) {
    var vm = this;
    vm.user = Authentication.user;

    $http({
      method: 'GET',
      url: '/api/taskapplications/mylist/' + vm.user._id
    }).then(function successCallback(response) {
        vm.taskapplications = response.data;
      }, function errorCallback(response) {
        console.log(response);
        vm.error = response;
      });
  }
})();
