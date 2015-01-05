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