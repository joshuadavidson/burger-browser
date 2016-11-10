angular
  .module('authService', [])

.factory('authService', ['$http', function($http) {

  var authService = {};

  //delete the session from the server to logout user
  authService.logout = function() {
    this.user = null;
    return $http.get('/api/logout');
  };

  //check if user is logged in
  authService.isLoggedIn = function() {
    return $http.get('/api/isloggedin');
  };

  //get the user's profile data
  authService.getUser = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
      if (self.user){
        resolve(self.user);
      }

      else {
        $http.get('/api/profile')
        .then(function(response){
          self.user = response.data;
          resolve(response.data);
        })
        .catch(function(error){
          self.user = null;
          resolve(null);
        });

      }
    });
  };

  //register a new local user
  authService.register = function(credentials) {
    return $http.post('/api/register', credentials);
  };

  //log in an existing local user
  authService.login = function(credentials) {
    return $http.post('/api/login', credentials);
  };

  return authService;

}]);
