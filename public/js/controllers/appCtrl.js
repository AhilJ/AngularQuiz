/*global angular*/

angular.module('angularQuiz.controllers').controller('appCtrl', [
  '$rootScope','$scope', 'authSvc', '$location',
  function ($rootScope, $scope, authSvc, $location) {
    'use strict';
    $scope._init = function () {
  var eventsSubscriptions = [];

      //handling page refresh
      if(!angular.isDefined($scope.isLoggedIn) || !angular.isDefined($scope.currentUser)) {
        $scope.isLoggedIn = authSvc.isLoggedIn();
        $scope.currentUser = authSvc.currentUser();
      }

      //check if user logged in and if is not redirect it to login page
      if (!$scope.isLoggedIn) {
        console.log('DENY');
        event.preventDefault();
        $location.path('login');
      }

      //receive the loggedIn event
      eventsSubscriptions.push($rootScope.$on('angularQuiz.loggedIn',  function (event, userName) {
        $scope.isLoggedIn = true;
        $scope.currentUser = userName;
      }));

      /**
       * Logout function
       */
      $scope.logout = function () {
        authSvc.logOut();
        $scope.isLoggedIn = false;
        $scope.currentUser = false;
        $location.path('login');
      };

    };

    // DESTRUCTOR
    $scope.$on('$destroy', function () {
      /**
       * Deregister all events in the eventsSubscriptions array
       * @param eventsSubscriptions
       */
        angular.forEach(eventsSubscriptions, function (remove) {
          // execute the deregistration function to clear the event subscription
          remove();
        });
    });

    // Run constructor
    $scope._init();

    if (angularQuizConfig.debug) {
      console.log('info', '[AppCtrl] initialized');
    }
  }
]);