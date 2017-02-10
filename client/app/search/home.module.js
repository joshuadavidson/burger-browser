/* establish global variables for ESLint */
/* global angular */

angular.module('burgerBrowser.home', [
  'burgerBrowser.header',
  'burgerBrowser.footer',
  'common.telephone.filter',
  'common.auth.service',
  'common.userLocation.service',
  'yelpService',
  'businessService',
]);
