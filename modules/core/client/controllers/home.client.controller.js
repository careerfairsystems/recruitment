'use strict';

angular.module('core').controller('HomeController', ['$http', '$scope', 'Authentication', 'TaskgroupsService', '$sce',
  function ($http, $scope, Authentication, TaskgroupsService, $sce) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    var vm = this;
    $scope.vm = vm;

//    vm.taskapplications = TaskgroupsService.query({ active: true }, function(u, responseHeaders) {
//      vm.activeTaskgroup = u[0];
//      vm.description = $sce.trustAsHtml(vm.activeTaskgroup.description);
//    });

    $http({
      method: 'GET',
      url: '/api/taskgroups/active'
    }).then(function successCallback(response) {
      vm.activeTaskgroup = response.data;
      vm.description = $sce.trustAsHtml(response.data.description);
      console.log(response);
    }, function errorCallback(response) {
      console.log('ERROR: ' + response);
    });



  }
]);
