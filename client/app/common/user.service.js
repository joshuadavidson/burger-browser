/* establish global variables for ESLint */
/* global angular */

angular.module('common.user.service', []).factory('userService', userService);

// inject dependencies into function
userService.$inject = [];

function userService() {
  // API
  // storage object for current user details
  var currentUser = {
    loggedIn: false,
    _id: null,
    name: null,
    email: null,
    provider: null,
    createdAt: null,
    updatedAt: null,
  };

  var service = {
    setUser: setUser,
    removeUser: removeUser,
    currentUser: currentUser,
  };

  return service;

  // API implementation

  // save user details to the storage object
  function setUser(user) {
    currentUser.loggedIn = true;
    currentUser._id = user._id;
    currentUser.name = user.name;
    currentUser.email = user.email;
    currentUser.provider = user.provider;
    currentUser.createdAt = user.createdAt;
    currentUser.updatedAt = user.updatedAt;
  }

  // remove data from storage object
  function removeUser() {
    currentUser.loggedIn = false;
    currentUser._id = null;
    currentUser.name = null;
    currentUser.email = null;
    currentUser.provider = null;
    currentUser.createdAt = null;
    currentUser.updatedAt = null;
  }
}
