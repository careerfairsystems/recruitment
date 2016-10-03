(function () {
  'use strict';

  angular
    .module('students')
    .controller('StudentsListController', StudentsListController);

  StudentsListController.$inject = ['StudentsService', '$scope', '$timeout'];

  function StudentsListController(StudentsService, $scope, $timeout) {
    var vm = this;

    vm.students = StudentsService.query();
    
    $scope.deleteAll = function(){
      function deleteStudent(student){
        var s = new StudentsService(student);
        s.$delete();
        console.log("Student deleted:" + s.name);
      }
      vm.students.forEach(deleteStudent);
      alert("Done");
      $timeout(function(){
        vm.students = StudentsService.query();
      });
    };

    $scope.loadCsv = function(){
      // TODO: Implement
      var text = $scope.csvStudentsText;
      var students = text.split("\n");
      students.shift(); // Rm header-row thats first

      function addStudent(rowText){
        var columns = rowText.split(";");
        var name = columns[0];
        var education = columns[1];
        var assignment = columns[2];

        StudentsService.post({ name: name, education: education, assignment: assignment });
        console.log("Student created:" + name);
      }
      students.forEach(addStudent);
      alert("Done");
      $scope.uploadCsv = false;
      $timeout(function(){
        vm.students = StudentsService.query();
      });
    };

  }
})();
