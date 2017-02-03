/* establish global variables for ESLint */
/* global angular */

angular
  .module('login', [
    'header',
    'footer',
    'authService',
  ])

.component('appLogin', {
  templateUrl: './app/auth/login.template.html',
  controller: ['$http', '$location', 'authService', function LoginController($http, $location, authService) {
    const self = this;

    // create an object to hold form data
    self.credentials = {
      email: null,
      password: null,
    };

    // variable to toggle email form
    self.showEmailForm = false;

    self.emailButtonClick = function () {
      // toggle email form
      self.showEmailForm = !self.showEmailForm;
      // clear any errors
      self.loginError = null;
    };

    self.login = function () {
      self.loginError = null;
      // if email entered is invalid
      if (!self.credentials.email && self.credentials.password) {
        self.loginError = 'Please provide a valid email.';
      }

      // if no password is entered
      if (!self.credentials.password && self.credentials.email) {
        self.loginError = 'Please provide a password.';
      }

      // if no email or password were passed
      if (!self.credentials.email && !self.credentials.password) {
        self.loginError = 'Please provide a valid email and password.';
      }

      // if both email and password are provided and valid
      if (self.credentials.email && self.credentials.password) {
        authService.login(self.credentials)
        .then((response) => {
          // redirect to root path
          $location.path('/');
        })

        .catch((err) => {
          self.loginError = err.data.message;
        });
      }
    };
  }],
});
