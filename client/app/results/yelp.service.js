/* establish global variables for ESLint */
/* global angular */

angular
.module('yelpService', [])
.factory('yelpService', yelpService);

// inject dependencies
yelpService.$inject = ['$http'];

function yelpService($http) {
  // API
  const service = {
    getBurgerJoints,
  };

  return service;

  // API implementation
  function getBurgerJoints(lat, lon) {
    const getBurgerJointsConfig = {
      method: 'GET',
      url: '/api/yelp/burgerjoints',
      params: {
        lat,
        lon,
      },
    };

    return $http(getBurgerJointsConfig)
      .then(response => response.data.businesses);
  }
}
