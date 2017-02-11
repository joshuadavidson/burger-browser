/* establish global variables for ESLint */
/* global angular */

angular.module('common.login.component')

.component('bbLogin', {
  templateUrl: './app/common/login/login.template.html',
  bindings: {
    user: '<',
  },
  controller: ['$http', '$state', 'authService', 'userService', function LoginController($http, $state, authService, userService) {
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
        .then((user) => {
          // redirect to root path
          $state.go('home');
        })

        .catch((err) => {
          self.loginError = err.data.message;
        });
      }
    };
  }],
});
