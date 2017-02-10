
/* establish global variables for ESLint */
/* global angular */

angular.module('common.auth.service', [])

.factory('authService', ['$http', function ($http) {
  const authService = {};

  // delete the session from the server to logout user
  authService.logout = function () {
    return $http.get('/api/logout');
  };

  // check if user is logged in
  authService.isLoggedIn = function () {
    return $http.get('/api/isloggedin');
  };

  // get the user's profile data
  authService.getUser = function () {
    return $http.get('/api/profile');
  };

  // register a new local user
  authService.register = function (credentials) {
    return $http.post('/api/register', credentials);
  };

  // log in an existing local user
  authService.login = function (credentials) {
    return $http.post('/api/login', credentials);
  };

  return authService;
}]);
