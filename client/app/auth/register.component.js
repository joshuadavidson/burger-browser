/* establish global variables for ESLint */
/* global angular */

angular
  .module('register', [
    'header',
    'footer',
    'authService',
  ])

.component('appRegister', {
  templateUrl: './app/auth/register.template.html',
  controller: ['$location', 'authService', function RegisterController($location, authService) {
    const self = this;

    // variable to toggle email form
    self.showEmailForm = false;

    self.emailButtonClick = function () {
      // toggle email form
      self.showEmailForm = !self.showEmailForm;
      // clear any errors
      self.registerError = null;
    };

    // create an object to hold form data
    self.credentials = {
      name: null,
      email: null,
      password: null,
    };

    // local email registration
    self.register = function () {
      self.registerError = null;
      // if no password is entered
      if (!self.credentials.password) {
        self.registerError = 'Please provide a password.';
      }

      // if email entered is invalid
      if (!self.credentials.email) {
        self.registerError = 'Please provide a valid email.';
      }

      // if no name is entered
      if (!self.credentials.name) {
        self.registerError = 'Please provide your name.';
      }

      // if both email and password are provided and valid
      if (self.credentials.email && self.credentials.password) {
        authService.register(self.credentials)
          // registration was successful
          .then((response) => {
            // redirect to root path
            $location.path('/');
          })

        // registation encountered an error
        .catch((registerError) => {
          self.registerError = registerError.data.message;
        });
      }
    };
  }],
});
