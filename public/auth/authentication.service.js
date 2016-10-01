angular
  .module('Authentication', [])

.factory('Authentication', ['$http', function($http) {

  var Authentication = {};

  //delete the session from the server to logout user
  Authentication.logout = function() {
    return $http.get('/api/logout');
  };

  //check if user is logged in
  Authentication.isLoggedIn = function() {
    return $http.get('/api/isloggedin');
  };

  //get the user's profile data
  Authentication.getUser = function() {
    return $http.get('/api/profile');
  };

  //register a new local user
  Authentication.register = function(credentials) {
    return $http.post('/api/register', credentials);
  };

  //log in an existing local user
  Authentication.login = function(credentials) {
    return $http.get('/api/login');
  };

  return Authentication;

}]);
