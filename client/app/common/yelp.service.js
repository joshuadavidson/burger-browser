/* establish global variables for ESLint */
/* global angular */

angular
.module('yelpService', [])
.factory('yelpService', ['$http', function ($http) {
  const Yelp = {};

  Yelp.getBurgerJoints = function (lat, lon) {
    const getBurgerJointsConfig = {
      method: 'GET',
      url: '/api/yelp/burgerjoints',
      params: {
        lat,
        lon,
      },
    };

    return $http(getBurgerJointsConfig);
  };

  return Yelp;
}]);
