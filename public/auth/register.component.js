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

    //variable to toggle email form
    self.showEmailForm = false;

    self.emailButtonClick = function() {
      self.showEmailForm = !self.showEmailForm; //toggle email form
      self.registerError = null; //clear any errors
    }

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
        self.registerError = 'Please provide a password.';
      }

      //if email entered is invalid
      if(!self.credentials.email){
        self.registerError = 'Please provide a valid email.';
      }

      //if no name is entered
      if(!self.credentials.name){
        self.registerError = 'Please provide your name.';
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
          self.registerError = err.data.message;
        });
      }

    };
  }]
});
