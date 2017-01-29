angular
  .module('header', [
    'ui.bootstrap'
  ])

.component('appHeader', {
  templateUrl: './app/common/header.template.html',
  controller: ['$location', 'authService', function HeaderController($location) {
    var self = this;
    //isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;
  }],
  bindings: {
    user: '<'
  }
});
