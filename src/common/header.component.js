import angular from 'angular';

export default angular.module('header', [
    // 'ui.bootstrap'
])
.component('appHeader', {
  templateUrl: './common/header.template.html',
  controller: ['$location', 'authService', function HeaderController($location) {
    const self = this;
    // isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;
  }],
  bindings: {
    user: '<',
  }
}).name;
