/*global angular*/

angular.module('angularQuiz.controllers').controller('loginCtrl', [
  '$rootScope', '$scope', 'authSvc', '$http', '$location',
  function ($rootScope, $scope, authSvc, $http, $location) {
    'use strict';
    $scope._init = function () {

      /**
       * Check Login function
       * @param user
       * @param pass
       */
      $scope.login = function (user, pass) {
        var foundUser = false;

        $http.get('mock/users.json').then(function(response) {
          angular.forEach(response.data.userInfo, function(userData) {
            if(!foundUser) {//little hack to improve the loop performance
              if (user === userData.email && pass === userData.password) {
                foundUser = true;
                $rootScope.$emit('angularQuiz.loggedIn', userData.name);
                authSvc.setUser(userData.name); //Update the state of the user in the app ;
                $location.path('/quiz.html');
              }
            }
          })
        });
      };


    };

    // DESTRUCTOR
    $scope.$on('$destroy', function () {

    });

    // Run constructor
    $scope._init();

    if (angularQuizConfig.debug) {
      console.log('info', '[LoginCtrl] initialized');
    }
  }
]);