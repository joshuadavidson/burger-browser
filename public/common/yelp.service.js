angular
  .module('yelp', [

  ])

.factory('yelp', ['$http', function($http) {
  var yelp = {};

  yelp.getBurgerJoints = function(lat, lon) {
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

  return yelp;

}]);
