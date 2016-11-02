angular
  .module('Yelp', [

  ])

.factory('Yelp', ['$http', function($http) {
  var Yelp = {};

  Yelp.getBurgerJoints = function(lat, lon) {
    var getBurgerJointsConfig = {
      method: 'GET',
      url: '/api/yelp/burgerjoints',
      params: {
        lat: lat,
        lon: lon
      }
    };

    return $http(getBurgerJointsConfig);
  };

  return Yelp;

}]);
