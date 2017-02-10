/* establish global variables for ESLint */
/* global angular */

angular.module('burgerBrowser.header')
.component('bbHeader', {
  templateUrl: './app/header/header.template.html',
  controller: ['$location', 'authService', function HeaderController() {
    const self = this;
    // isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;
  }],
  bindings: {
    user: '<',
  },
});
