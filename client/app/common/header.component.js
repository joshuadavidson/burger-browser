/* establish global variables for ESLint */
/* global angular */

angular
  .module('header', [
    'ui.bootstrap',
  ])

.component('appHeader', {
  templateUrl: './app/common/header.template.html',
  controller: ['$location', 'authService', function HeaderController() {
    const self = this;
    // isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;
  }],
  bindings: {
    user: '<',
  },
});
