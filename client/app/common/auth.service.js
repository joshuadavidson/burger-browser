/* establish global variables for ESLint */
/* global angular */

angular.module('common.auth.service', ['common.user.service']).factory('authService', authService);

// inject dependencies
authService.$inject = ['$http', 'userService'];

function authService($http, userService) {
  // API
  var service = {
    logout: logout,
    getUser: getUser,
    register: register,
    login: login,
  };

  return service;

  // API implementation
  // delete the session from the server to logout user
  function logout() {
    return $http.get('/api/logout').then(removeCurrentUser);
  }

  // get the user's profile data
  function getUser() {
    return $http.get('/api/user').then(setCurrentUser);
  }

  // register a new local user
  function register(credentials) {
    return $http.post('/api/register', credentials).then(setCurrentUser);
  }

  // log in an existing local user
  function login(credentials) {
    return $http.post('/api/login', credentials).then(setCurrentUser);
  }

  // callback function to set current user in user Service
  function setCurrentUser(response) {
    if (response.status === 200) {
      userService.setUser(response.data.user);
    }
  }

  // callback function to remove current user in user Service
  function removeCurrentUser() {
    userService.removeUser();
  }
}
