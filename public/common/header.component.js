angular
  .module('header', [
    'ui.bootstrap',
    'authService'
  ])

.component('appHeader', {
  templateUrl: './common/header.template.html',
  controller: ['$location', 'authService', function HeaderController($location, authService) {
    var self = this;

    //isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;

    //check for logged in state
    authService.getUser()
    .then(function(response){
      self.user = response.data;
    })
    .catch(function(err){
      self.user = null;
    });

    self.logout = function() {
      authService.logout();
    };
  }]
});
