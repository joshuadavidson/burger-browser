angular
  .module('UserLocation', [

  ])

.factory('UserLocation', ['$window', '$http', function($window, $http) {
  var UserLocation = {};

  UserLocation.getCoords = function() {

    return new Promise(function(resolve, reject) {
      //get user's coords from browser if available
      if ($window.navigator.geolocation) {
        $window.navigator.geolocation.getCurrentPosition(function(position) {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        }, function(error) {
          reject(error);
        });
      }

      //if geolocation is not enabled then use IP address to obtain coords
      else {
        $http.get('https://freegeoip.net/json/')
          .then(function(res) {
            resolve({
              lat: res.data.latitude,
              lon: res.data.longitude
            });
          })
          .catch(function(error) {
            reject(error);
          });
      }
    });
  };

  UserLocation.parseAddress = function(geocodeData) {
    var location = {};
    var addressData = geocodeData[1].data.results[0]; //location of address data within geocode object

    //store latitute and longitude data
    location.lat = geocodeData[0].lat;
    location.lon = geocodeData[0].lon;

    //store the raw formatted address from google
    location.formattedAddress = addressData.formatted_address;

    //parse geocode results to location object
    for (var i = 0; i < addressData.address_components.length; i++) {
      var component = addressData.address_components[i].short_name;

      for (var j = 0; j < addressData.address_components[i].types.length; j++) {
        var currType = addressData.address_components[i].types[j];
        switch (currType) {
          case "street_number":
            location.house = component;
            break;
          case "route":
            location.street = component;
            break;
          case "neighborhood":
            location.neighborhood = component;
            break;
          case "locality":
            location.city = component;
            break;
          case "administrative_area_level_2":
            location.county = component;
            break;
          case "administrative_area_level_1":
            location.state = component;
            break;
          case "postal_code":
            location.postalCode = component;
            break;
          case "country":
            location.country = component;
            break;
        }
      }
    }

    //return the assembled location object
    return location;
  };

  UserLocation.getGeoCodeData = function(coords) {
    return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: coords.lat + ',' + coords.lon,
        key: 'AIzaSyBI_S0PtZF_qjsPhbqql5HlUoTj0pM5RYQ'
      }
    });
  };

  UserLocation.getLocation = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.getCoords()

      .then(function(coords) {
        return Promise.all([coords, self.getGeoCodeData(coords)]);
      })

      .then(function(geocodeData) {
        resolve(self.parseAddress(geocodeData));
      })

      .catch(function(error) {
        reject(error);
      });

    });
  };

  return UserLocation;
}]);
