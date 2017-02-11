/* establish global variables for ESLint */
/* global angular */

angular.module('burgerBrowser', [
  // Feature Modules
  'burgerBrowser.home',
  'burgerBrowser.pageNotFound',

  // Common Reusable Modules
  'common.register.component',
  'common.login.component',
  'common.user.service',

  // 3rd Party Modules
  'ui.router',
])

.config(configBlock)
.run(runBlock);

// Inject dependencies into function
configBlock.$inject = ['$locationProvider', '$stateProvider', '$urlServiceProvider'];

function configBlock($locationProvider, $stateProvider, $urlServiceProvider) {
  // use HTML5 History to remove the # in URLs
  $locationProvider.html5Mode(true);

  // Handle unkonwn routes by redirecting to home
  $urlServiceProvider.rules.otherwise({ state: 'home' });

  // Redirect for funky Facebook URL addition _=_
  $urlServiceProvider.rules.when('/_=_', '/');

  // setup URL routes
  $stateProvider
  .state('home', {
    url: '/',
    views: {
      header: 'bbHeader',
      content: 'bbHome',
    },
  })

  .state('login', {
    url: '/login',
    views: {
      header: 'bbHeader',
      content: 'bbLogin',
    },
  })

  .state('register', {
    url: '/register',
    views: {
      header: 'bbHeader',
      content: 'bbRegister',
    },
  });
}

// Inject dependencies into function
runBlock.$inject = ['authService'];

function runBlock(authService) {
  // check to see if user's session is still active on first load
  authService.getUser();
}
