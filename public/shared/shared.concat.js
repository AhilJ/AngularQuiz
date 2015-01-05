angular.module('login', []);
angular.module('quiz', []);
angular.module('results', []);

angular.module('angularQuiz.controllers', []);
angular.module('angularQuiz.services', []);
angular.module('angularQuiz.directives', []);
angular.module('angularQuiz.filters', []);

// Declare app level module which depends on filters, and services
angular.module('angularQuiz', [
  'angularQuiz.controllers',
  'angularQuiz.services',
  'angularQuiz.directives',
  'angularQuiz.filters',

  // AngularJS
  'ngRoute',

  // All modules are being loaded here but EMPTY - they will be filled with controllers and functionality
  'login',
  'quiz',
  'results'
]);

// configure our routes
angular.module('angularQuiz').config([
  '$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    'use strict';
    $locationProvider.html5Mode(true);

    $routeProvider
      // route for the home page
        .when('/', {
          templateUrl: 'views/quiz.html',
          controller: 'quizCtrl',
          access: {
            auth: false
          }
        })
        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'loginCtrl',
          access: {
            auth: false
          }
        })
        .otherwise({
          redirectTo: '/'
        });
  }
]);

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
/*global angular*/

angular.module('angularQuiz.controllers').controller('quizCtrl', [
  '$scope', 'authSvc', '$location', '$http',
  function ($scope, authSvc, $location, $http) {
    'use strict';
    $scope._init = function () {

      $scope.quizData = {};

      //var that holds the answers
      $scope.results = []; // user results

      //get quiz data
      $http.get('mock/quiz.json').then(function(response) {
        $scope.quizData = response.data.questions;
        // prepare array of result objects
          var len = $scope.quizData.length;
          for (var i = 0; i < len; i++) {
            $scope.results.push({
              _id:        $scope.quizData[i]._id,
              answers:     $scope.quizData[i].answers,
              userChoice: [],
              correct:    null
            });
          }
      });

      // used for multiple correct type questions
      $scope.submitQuiz = function () {
        var foundError = false;

        //see if all questions have an answer
        angular.forEach($scope.results, function(question) {
          //see if all questions have an answer
          if(!foundError) {
            if (question.userChoice.length === 0) {
              alert("You forgot to answer at question " + question._id);
              foundError = true;
              return false;
            }
          }
        });
        if (foundError === false) {
          angular.forEach($scope.results, function(question) {
            $scope.checkAnswer(question);
          });
          $scope.quizSubmitted = true;
        }
      };

      /**
       * check answer and assign correct/incorrect
       * @param question
       */
      $scope.checkAnswer = function(question) {
        if(question.answers.equals(question.userChoice)) {
          question.correct = true;
        } else {
          question.correct = false;
        }
      };

      // used for multiple choice and true-false type questions
      $scope.checkUserChoice = function (question, userChoice) {
        var foundAnswer = false,
            currentQuestion = $scope.results[question._id - 1];

        //check if userChoice exest and remove it
        for (var i = currentQuestion.userChoice.length - 1; i >= 0; i--) {
          if (currentQuestion.userChoice[i] === userChoice) {
            foundAnswer = true;
            currentQuestion.userChoice.splice(i, 1);
          }
        }

        //if answer doesn't exist then add it
        if(!foundAnswer) {
          currentQuestion.userChoice.push(userChoice);
        }
        currentQuestion.userChoice.sort();
      };

// attach the .equals method to Array's prototype to call it on any array
      Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
          return false;

        // compare lengths - can save a lot of time
        if (this.length != array.length)
          return false;

        for (var i = 0, l=this.length; i < l; i++) {
          // Check if we have nested arrays
          if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
              return false;
          }
          else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
          }
        }
        return true;
      }
    };

    // DESTRUCTOR
    $scope.$on('$destroy', function () {

    });

    // Run constructor
    $scope._init();

    if (angularQuizConfig.debug) {
      console.log('info', '[QuizCtrl] initialized');
    }
  }
]);
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

/*global angular*/
angular.module('angularQuiz.services').factory('authSvc', function ($window) {
  var user;

  return{
    setUser : function(aUser){
      $window.sessionStorage["userInfo"] = JSON.stringify(aUser);
      user = aUser;
    },
    isLoggedIn : function(){
      user = $window.sessionStorage["userInfo"];
      return user;
    },
    currentUser : function(){
      user = $window.sessionStorage["userInfo"];
      return (user !== null) ? angular.fromJson(user) : false;
    },
    logOut : function(){
      $window.sessionStorage.removeItem("userInfo");
    }
  }
});