/* establish global variables for ESLint */
/* global angular */

angular.module('yelpService', []).factory('yelpService', yelpService);

// inject dependencies
yelpService.$inject = ['$http'];

function yelpService($http) {
  // API
  var service = {
    getBurgerJoints: getBurgerJoints,
  };

  return service;

  // API implementation
  function getBurgerJoints(lat, lon) {
    var getBurgerJointsConfig = {
      method: 'GET',
      url: '/api/yelp/burgerjoints',
      params: {
        lat: lat,
        lon: lon,
      }
    };

    return $http(getBurgerJointsConfig).then(function (response) {
      return response.data.businesses;
    });
  }
}
