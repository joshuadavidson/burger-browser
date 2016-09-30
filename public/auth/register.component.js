angular
  .module('register', [
    'header',
    'footer',
    'Authentication'
  ])

.component('appRegister', {
  templateUrl: './auth/register.template.html',
  controller: ['$location', 'Authentication', function RegisterController($location, Authentication) {
    var self = this;

    //create an object to hold form data
    self.credentials = {
      name: null,
      email: null,
      password: null
    };

    console.log(Authentication.isLoggedIn());

    self.onSubmit = function() {
      //if no password is entered
      if(!self.credentials.password){
        self.loginError = 'Please provide a password.';
      }

      //if email entered is invalid
      if(!self.credentials.email){
        self.loginError = 'Please provide a valid email.';
      }

      //if no name is entered
      if(!self.credentials.name){
        self.loginError = 'Please provide your name.';
      }

      //Form is valid attempt registration
      if (self.credentials.name && self.credentials.email && self.credentials.password) {

        Authentication.register(self.credentials)
        //registration was successful
        .then(function(response) {
          $location.path('/');
        })

        //registation encountered an error
        .catch(function(err) {
          self.loginError = err.data.message;
        });
      }

    };
  }]
});
