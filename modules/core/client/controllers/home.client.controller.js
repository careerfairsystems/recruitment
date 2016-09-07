'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'TaskgroupsService', '$sce',
  function ($scope, Authentication, TaskgroupsService, $sce) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    var vm = this;
    $scope.vm = vm;

    vm.taskapplications = TaskgroupsService.query({ active: true }, function(u, responseHeaders) {
      vm.activeTaskgroup = u[0];
      vm.description = $sce.trustAsHtml(vm.activeTaskgroup.description);
    });


  }
]);
