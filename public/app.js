angular
  .module('burgerBrowser', [
    'ngRoute',
    'home',
    'register',
    'login',
    'pageNotFound'
  ])
/*
  .config(['$locationProvider', '$urlRouterProvider',  '$stateProvider', function($locationProvider, $urlRouterProvider, $stateProvider){
    //use HTML5 History to remove the # in URLs
    $locationProvider.html5Mode(true);

    //account for invalid routes--send to home
    $urlRouterProvider.otherwise('/');

    //establish an array of states
    var states = [
      {
        name: 'test',
        url:'/test',
        template: '<h1>Hi!</h1>'
      },
    ];

    //regsiter the states with the state provider
    states.forEach(function(state){
      $stateProvider.state(state);
    });
  }]);
  */

///*
  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    //use HTML5 History to remove the # in URLs
    $locationProvider.html5Mode(true);

    //setup URL routes
    $routeProvider.when('/', {
      template: '<app-home></app-home>'
    })

    //deal with funky Facebook redirect URL addition _=_
    .when('/_=_', {
      redirectTo: '/'
    })

    .when('/register', {
      template: '<app-register></app-register>'
    })

    .when('/login', {
      template: '<app-login></app-login>'
    })

    .otherwise({
      template: '<app-page-not-found></app-page-not-found>'
    });

  }]);
//*/
