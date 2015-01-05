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