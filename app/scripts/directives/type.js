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
  'Property',

  function(
    $rootScope,
    $timeout,
    $compile,
    $templateCache,
    $http,
    Profile,
    Type,
    Property
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

    // property types
    scope.config = {
      property: {
        types: {
          'text': 'text',
          'number': 'number',
          'range': 'range',
          'color': 'color',
          'password': 'password',
          'date': 'date',
          'time': 'time',
          'datetime': 'datetime',
          'url': 'url'
        }
      }
    };



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



    /*
     * GENERIC BEHAVIOUR
     */

    /* open and close one connection */
    scope.toggle = function(connection) {
      connection.open = !connection.open;
    }

    /* check if the owner is logged in */
    scope.isOwner = function() {
      return (Profile.get() && Profile.get().id == scope.type.owner.id);
    }

    /* Default visualization */
    scope.showDefault = function() {
      scope.view.path = '/default';
    }

    scope.setConnection = function(connection) {
      scope.connection = connection;
      scope.showDefault();
    }



    /*
     * PROPERTY BEHAVIOUR
     */

    /* remove one element to the list of the accepted elements */
    scope.removeAccepted = function(property, index, form) {
      delete property.accepted.splice(index, 1);
      form.$setDirty(); // bug (the dirty is not activated otherwise)
    }

    /* add one element to the list of the accepted elements */
    scope.addAccepted = function(property) {
      property.accepted.push({key: '', value: ''});
    }

    scope.addProperty = function() {
      Property.create({name: 'New property', type: 'text'}).
        success(function(response) {
          response.open = true;
          scope.type.properties.unshift(response);
          var properties = _.pluck(scope.type.properties, 'id')
          Type.update(scope.type.id, { properties: properties });
        });
    }

    scope.confirmDeleteProperty = function(type, property, index) {
      scope.toDelete = { type: type, connection: property, index: index };
      scope.view.path = '/delete' ;
    }

    scope.deleteProperty = function(confirm) {
      if (scope.toDelete.connection.name == confirm) {
        var connection = scope.toDelete.connection;
        var index = scope.toDelete.index;

        if (scope.toDelete.type == 'property') {
          Property.delete(connection.id).
            success(function(response) {
              scope.type.properties.splice(index, 1);
              var properties = _.pluck(scope.type.properties, 'id')
              Type.update(scope.type.id, { properties: properties });
              scope.showDefault();
            });
        }
      }
    }

    scope.updateProperty = function(property, form) {
      property.status = 'Saving';
      Property.update(property.id, property).
        success(function(response) {
          $timeout(function() {
            property.status = null;
            form.$setPristine()
          }, 500);
        }).
        error(function(data, status) {
          scope.view.path = '/message';
          scope.message = { title: 'Something went wrong', description: 'There was a problem while saving the property.' }
        });
    }

  }

  return definition
}]);
