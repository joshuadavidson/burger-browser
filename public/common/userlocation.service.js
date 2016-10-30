angular
  .module('UserLocation', [

  ])

.factory('UserLocation', ['$window', '$http', function($window, $http) {
  var UserLocation = {};

  UserLocation.geolocationEnabled = function() {
    if ($window.navigator.geolocation) {
      return true;
    } else {
      return false;
    }
  };

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

  UserLocation.extractCityStateCountry = function(json) {
    var location = {};

    //find the city, state, and country from google geocode results
    for (var i = 0; i < json.results[0].address_components.length; i++) {
      for (var j = 0; j < json.results[0].address_components[i].types.length; j++) {
        var currType = json.results[0].address_components[i].types[j];
        switch (currType) {
          case "country":
            location.country = json.results[0].address_components[i].short_name;
            break;
          case "administrative_area_level_1":
            location.state = json.results[0].address_components[i].short_name;
            break;
          case "locality":
            location.city = json.results[0].address_components[i].short_name;
            break;
        }
      }
    }

    //Assemble the location text with tabs, remove empty values, the replace tabs with ', '
    location.locationText = location.city + "\u0009" + location.state + "\u0009" + location.country;
    location.locationText = userData.location.locationText.trim().replace(/\t/g, ", ");

    //return the human readable location
    return location;
  };

  UserLocation.getGeoCodeData = function(coords) {
    return $http.get('htps://maps.googleapis.com/maps/api/geocode/json', {
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

      .then(function(results) {
        //return the result of the extraction of city and state from the geocode data
        resolve(self.extractCityStateCountry(results[1].data));
      })

      .catch(function(error) {
        reject(error);
      });

    });
  };

  return UserLocation;
}]);
