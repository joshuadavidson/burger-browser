angular
  .module('UserLocation', [

  ])

.factory('UserLocation', ['$window', '$http', function($window, $http){
  var UserLocation = {};

  UserLocation.geolcationEnabled = function(){
    if($window.navigator.geolocation){
      return true;
    } else {
      return false;
    }
  };

  UserLocation.getCoords = new Promise(function(resolve, reject){
    //get user's coords from browser if available
    if($window.navigator.geolocation) {
      $window.navigator.geolocation.getCurrentPosition(function(position){
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      }, function(error){
        reject(error);
      });
    }

    //if geolocation is not enabled then use IP address to obtain coords
    else {
      $http.get('https://freegeoip.net/json/')
      .then(function(res){
        resolve({
          lat: res.data.latitude,
          lon: res.data.longitude
        });
      })
      .catch(function(error){
        reject(error);
      });
    }
  });

  UserLocation.getLocationText = function(coords){

  };

  UserLocation.get = function(){
    return true;
  };

  return UserLocation;
}]);
