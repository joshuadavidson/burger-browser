angular
  .module('burgerBrowser')
  .component('mainHeader', {
    templateUrl: './common/header.template.html',
    controller: ['$location', 'authService', '$scope', function HeaderController($location, authService, $scope) {
      var self = this;

      //isCollapsed toggles when the user selects a link from the navbar menu
      self.isCollapsed = true;

      console.log("user from scope:");
      console.log(self.currentUser);

      self.onLogout = function() {
        authService.logout();
        self.user = null;
      };
    }],
    bindings: {
      user: '<',
      onLogout: '&'
    }
  });
