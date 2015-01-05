/*global angular*/
/**
 * Directive for showing menu after user is logged in
 *
 * @example <top-menu></top-menu>
 **/
angular.module('angularQuiz.directives').directive('topMenu', [
  '$rootScope',
  function ($rootScope) {
    'use strict';
    return {
      templateUrl: '../views/directives/topMenu.html',
      link: function (scope) {
        // CONSTRUCTOR
        scope._init = function () {
          //some extra functionality here in future...
        };

        // DESTRUCTOR
        scope.$on('$destroy', function () {

        });

        // Run constructor
        scope._init();
      }
    };
  }
]);
