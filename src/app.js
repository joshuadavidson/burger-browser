import angular from 'angular';
import 'angular-route';
// import home from './common/home.component';
 import register from './auth/register.component';
// import login from './auth/login.component';
// import pageNotFound from './common/pageNotFound.component';

angular
  .module('burgerBrowser', [
    'ngRoute',
    // home,
     register,
    // login,
    // pageNotFound,
  ])

  .config(['$locationProvider', '$routeProvider', function burgerBrowserConfig($locationProvider, $routeProvider) {
    // use HTML5 History to remove the # in URLs
    $locationProvider.html5Mode(true);

    // setup URL routes
    $routeProvider.when('/', {
      template: '<app-home></app-home>',
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
      template: '<app-page-not-found></app-page-not-found>',
    });
  }]);
