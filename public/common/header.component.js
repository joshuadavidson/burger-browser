angular
  .module('header', [
    'ui.bootstrap',
    'Authentication'
  ])

.component('appHeader', {
  templateUrl: './common/header.template.html',
  controller: ['$location', 'Authentication', function HeaderController($location, Authentication) {
    var self = this;

    //isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;

    //check for logged in state
    Authentication.getUser()
    .then(function(response){
      self.user = response.data;
    })
    .catch(function(err){
      self.user = null;
    });

    self.logout = function() {
      Authentication.logout();
    };
  }]
});
