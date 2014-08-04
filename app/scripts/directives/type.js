'use strict';

angular.module('lelylan.directives.type.directive', [])

angular.module('lelylan.directives.type.directive').directive('type', [
  '$rootScope',
  '$timeout',
  '$compile',
  '$templateCache',
  '$http',
  'Profile',
  'Type',

  function(
    $rootScope,
    $timeout,
    $compile,
    $templateCache,
    $http,
    Profile,
    Type
  ) {

  var definition = {
    restrict: 'EA',
    replace: true,
    scope: {
      typeId: '@',
      typeTemplate: '@'
    }
  };

  definition.link = function(scope, element, attrs) {


    /*
     * CONFIGURATIONS
     */

    // active view
    scope.view = { path: '/loading' }

    // active connection
    scope.connection = 'properties';

    // template
    scope.template = attrs.deviceTemplate || 'views/templates/default.html';


    /*
     * DYNAMIC LAYOUT
     */

    var compile = function() {
      $http.get(scope.template, { cache: $templateCache }).success(function(html) {
        element.html(html);
        $compile(element.contents())(scope);
      });
    }

    compile();



    /*
     * API REQUESTS
     */

    /* watches the device ID and gets the device representation and calls the type API */
    scope.$watch('typeId', function(value) {
      if (value) {
        Type.find(value).
          success(function(response) {
            scope.view.path = '/default';
            scope.type = response;
          }).
          error(function(data, status) {
            scope.view.path = '/message';
            scope.message   = { title: 'Something went wrong', description: 'Most probably the type you are trying to load does not exist' }
          });
      }
    });

    scope.toggle = function(connection) {
      connection.open = !connection.open;
    }

  }

  return definition
}]);
