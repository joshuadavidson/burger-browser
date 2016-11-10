angular
.module('burgerBrowser', [
  'ui.router',
  'ui.bootstrap',
  'userLocation',
  'authentication',
  'yelp'
])
.config(['$locationProvider', '$urlRouterProvider',  '$stateProvider',  function($locationProvider, $urlRouterProvider, $stateProvider){
  //use HTML5 History to remove the # in URLs
  $locationProvider.html5Mode(true);

  //account for invalid routes--send to home
  $urlRouterProvider.otherwise('/');

  //establish states
  $stateProvider
    //define structure of views for the page
    .state('main', {
      views: {
        'header': {
          component: 'mainHeader',
        },
        content: {
          template: '<div ui-view></div>'
        },
        footer: 'mainFooter'
      },
      resolve: {
        user: ['authentication', function(authentication) {
          return authentication.getUser();
        }]
      }
    })

    //define content view states
    .state('main.home', {
      url: '/',
      component: 'home',
    })

    .state('main.register', {
      url: '/register',
      component: 'register'
    })

    .state('main.login', {
      url: '/login',
      component: 'login'
    });

}]);
