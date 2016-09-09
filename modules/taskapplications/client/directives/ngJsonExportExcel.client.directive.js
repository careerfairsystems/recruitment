/*globals saveAs */
(function () {
  'use strict';

  angular.module('taskapplications')
    .directive('ngJsonExcel', function () {
      return {
        restrict: 'AE',
        scope: true,
        controller: function ($scope, $element) {
          var d = new Date();
          var res = d.toISOString().slice(0,10).replace(/-/g,"");
          $scope.filename = "Applications-" + res;
          var fields = [];
          var header = [];
          var separator = $scope.separator || ';';

          $scope.myOnclickFunction = function (myfields, taskapplications) {
            angular.forEach(myfields, function(field, key) {
              if(!field || !key) {
                throw new Error('error json report fields');
              }
              fields.push(key);
              header.push(field);
            });
            console.log(fields);
            var bodyData = _bodyData(taskapplications);
            var strData = _convertToExcel(bodyData);
            var blob = new Blob([strData], { type: 'text/plain;charset=utf-8' });
            fields = [];
            header = [];
            return saveAs(blob, [$scope.filename + '.csv']);
          };

          function _bodyData(taskapplications) {
            var data = taskapplications;
            var body = "";
            angular.forEach(data, function(dataItem) {
              var rowItems = [];
              angular.forEach(fields, function(field) {
                if(field.indexOf('.')) {
                  field = field.split(".");
                  var curItem = dataItem;
                  // deep access to obect property
                  angular.forEach(field, function(prop){
                    if (curItem !== null && curItem !== undefined) {
                      curItem = curItem[prop];
                    }
                  });
                  data = curItem;
                } else {
                  data = dataItem[field];
                }

                var fieldValue = data !== null ? data : ' ';
                console.log('fieldValue: ' + fieldValue);

                if (fieldValue !== undefined && angular.isObject(fieldValue)) {
                  fieldValue = _objectToString(fieldValue);
                }

                if(typeof fieldValue === 'string') {
                  rowItems.push('"' + fieldValue.replace(/"/g, '""') + '"');
                } else {
                  rowItems.push(fieldValue);
                }
                fieldValue = [];
                field = [];
              });
              body += rowItems.join(separator) + '\n';
            });
            return body;
          }

          function _convertToExcel(body) {
            return header.join(separator) + '\n' + body;
          }

          function _objectToString(object) {
            var output = '';
            angular.forEach(object, function(value, key) {
              output += key + ':' + value + ' ';
            });
            console.log(output);
            return '"' + output + '"';
          }
        }
      };
    }
  );
})();
