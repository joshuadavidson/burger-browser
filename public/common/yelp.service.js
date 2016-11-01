angular
  .module('Yelp', [

  ])

.factory('Yelp', ['$http', '$window', function($http, $window) {
  var Yelp = {};

  Yelp.getAccessToken = function() {
    return new Promise(function(resolve, reject) {
      var token = $window.localStorage.getItem('yelptoken');

      //if the token is in storage then use it
      if (token) {
        resolve(token);
      }

      //else generate a new token by requesting from server
      else {
        $http.get('api/auth/yelptoken')
          .then(function(response) {
            $window.localStorage.setItem('yelptoken', response.data.yelptoken);
            resolve(response.data.yelptoken);
          })
          .catch(function(error) {
            reject(error);
          });
      }
    });
  };

  Yelp.getBurgerJoints = function(lat, lon) {
    var self = this;

    self.getAccessToken()

    .then(function(token) {
      return $http.get('https://api.yelp.com/v3/businesses/search', {
        data: {
          term: 'burgers',
          latitude: lat,
          longitude: lon,
          sort_by: 'distance'
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
    })

    .catch(function(error) {
      return error;
    });
  };

  return Yelp;
}]);
