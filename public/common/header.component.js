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

    //setup an object for the profile data
    self.user = {};

    //check login status
    self.isLoggedIn = false;
    Authentication.isLoggedIn()
      .then(function(response) {
        self.isLoggedIn = response.data.status;

        //if logged in get the user data
        if (self.isLoggedIn) {
          Authentication.getUser()
            //store the users data
            .then(function(response) {
              self.user = response.data;
            });
        }
      });

    self.logout = function() {
      Authentication.logout();
    };
  }]
});
