'use strict';

angular.module('lelylan.directives.type', [
  'lelylan.client',
  'lelylan.directives.type.directive',
  'ngTouch',
  'ngAnimate',
  'ngClipboard'
])
.config(['ngClipProvider', function(ngClipProvider) {
  ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
}]);

