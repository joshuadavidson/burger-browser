/* establish global variables for ESLint */
/* global angular */

angular
  .module('burgerBrowser', [
    // Angular Modules
    'ngRoute',

    // Feature Modules
    'burgerBrowser.home',
    'burgerBrowser.pageNotFound',

    // Common Reusable Modules
    'common.register.component',
    'common.login.component',

    // 3rd Party Modules
    'ui.router',
  ])

  .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    // use HTML5 History to remove the # in URLs
    $locationProvider.html5Mode(true);

    // setup URL routes
    $routeProvider.when('/', {
      template: '<bb-home></bb-home>',
    })

    // deal with funky Facebook redirect URL addition _=_
    .when('/_=_', {
      redirectTo: '/',
    })

    .when('/register', {
      template: '<app-register></app-register>',
    })

    .when('/login', {
      template: '<app-login></app-login>',
    })

    .otherwise({
      template: '<bb-page-not-found></bb-page-not-found>',
    });
  }]);
