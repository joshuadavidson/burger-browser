/* establish global variables for ESLint */
/* global angular */

angular.module('burgerBrowser.header')
.component('bbHeader', {
  templateUrl: './app/header/header.template.html',
  controller: ['$state', 'authService', 'userService', function HeaderController($state, authService, userService) {
    const self = this;
    // isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;

    // grab the current user from the user service
    self.user = userService.currentUser;

    // logout
    self.logout = function () {
      authService.logout();
    };
  }],
});
