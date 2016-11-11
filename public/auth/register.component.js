angular
  .module('register', [
    'header',
    'footer',
    'authService'
  ])

.component('appRegister', {
  templateUrl: './auth/register.template.html',
  controller: ['$location', 'authService', function RegisterController($location, authService) {
    var self = this;

    //variable to toggle email form
    self.showEmailForm = false;

    self.emailButtonClick = function() {
      self.showEmailForm = !self.showEmailForm; //toggle email form
      self.registerError = null; //clear any errors
    };

    //create an object to hold form data
    self.credentials = {
      name: null,
      email: null,
      password: null
    };

    //local email registration
    self.register = function() {
      self.registerError = null;
      //if no password is entered
      if (!self.credentials.password) {
        self.registerError = 'Please provide a password.';
      }

      //if email entered is invalid
      if (!self.credentials.email) {
        self.registerError = 'Please provide a valid email.';
      }

      //if no name is entered
      if (!self.credentials.name) {
        self.registerError = 'Please provide your name.';
      }

      //if both email and password are provided and valid
      if (self.credentials.email && self.credentials.password) {
        authService.register(self.credentials)
          //registration was successful
          .then(function(response) {
            console.log(response);
            $location.path('/');
          })

        //registation encountered an error
        .catch(function(err) {
          console.log(err);
          self.registerError = err.data.message;
        });
      }

    };
  }]
});
