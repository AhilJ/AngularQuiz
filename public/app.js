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
