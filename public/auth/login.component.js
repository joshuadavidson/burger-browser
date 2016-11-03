angular
  .module('login', [
    'header',
    'footer',
    'Authentication'
  ])

.component('appLogin', {
  templateUrl: './auth/login.template.html',
  controller: ['$http', '$location', 'Authentication', function LoginController($http, $location, Authentication) {
    var self = this;

    //create an object to hold form data
    self.credentials = {
      email: null,
      password: null
    };

    //variable to toggle email form
    self.showEmailForm = false;

    self.emailButtonClick = function() {
      self.showEmailForm = !self.showEmailForm; //toggle email form
      self.loginError = null; //clear any errors
    };

    self.login = function() {
      self.loginError = null;
      //if email entered is invalid
      console.log('made it to login function');
      if(!self.credentials.email && self.credentials.password){
        self.loginError = 'Please provide a valid email.';
      }

      //if no password is entered
      if(!self.credentials.password && self.credentials.email){
        self.loginError = 'Please provide a password.';
      }

      //if no email or password were passed
      if(!self.credentials.email && !self.credentials.password){
        self.loginError = 'Please provide a valid email and password.';
      }

      //if both email and password are provided and valid
      if (self.credentials.email && self.credentials.password) {
        console.log('made it to auth function');
        console.log('sending credentials:');
        console.log(self.credentials);
        Authentication.login(self.credentials)
        .then(function(response) {
          console.log('made it to response');
          console.log(response);
          $location.path('/');
        })

        .catch(function(err) {
          console.log('error occured during auth.');
          self.loginError = err.data.message;
        });
      }

    };
  }]
});
