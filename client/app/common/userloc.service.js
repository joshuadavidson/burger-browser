/* establish global variables for ESLint */
/* global angular */

angular
.module('userLocService', [])

.factory('userLocService', ['$window', '$http', function ($window, $http) {
  const userLocService = {};

  userLocService.getCoords = function () {
    return new Promise((resolve, reject) => {
      // get user's coords from browser if available
      if ($window.navigator.geolocation) {
        $window.navigator.geolocation.getCurrentPosition((position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        }, (getCurrentPositionError) => {
          getCurrentPositionError.occuredAt = 'getGeolocation';
          reject(getCurrentPositionError);
        });
      }

      // if geolocation is not enabled then use IP address to obtain coords
      else {
        $http.get('https://freegeoip.net/json/')
          .then((res) => {
            resolve({
              lat: res.data.latitude,
              lon: res.data.longitude,
            });
          })
          .catch((freeGeoIPError) => {
            freeGeoIPError.occuredAt = 'getIP';
            reject(freeGeoIPError);
          });
      }
    });
  };

  userLocService.parseAddress = function (geocodeData) {
    const location = {};
    // location of address data within geocode object
    const addressData = geocodeData[1].data.results[0];

    // store latitute and longitude data
    location.lat = geocodeData[0].lat;
    location.lon = geocodeData[0].lon;

    // store the raw formatted address from google
    location.formattedAddress = addressData.formatted_address;

    // parse geocode results to location object
    for (let i = 0; i < addressData.address_components.length; i += 1) {
      const component = addressData.address_components[i].short_name;

      for (let j = 0; j < addressData.address_components[i].types.length; j += 1) {
        const currType = addressData.address_components[i].types[j];
        switch (currType) {
          case 'street_number':
            location.house = component;
            break;
          case 'route':
            location.street = component;
            break;
          case 'neighborhood':
            location.neighborhood = component;
            break;
          case 'locality':
            location.city = component;
            break;
          case 'administrative_area_level_2':
            location.county = component;
            break;
          case 'administrative_area_level_1':
            location.state = component;
            break;
          case 'postal_code':
            location.postalCode = component;
            break;
          case 'country':
            location.country = component;
            break;
          // no default
        }
      }
    }

    // return the assembled location object
    return location;
  };

  userLocService.getGeoCodeData = function (coords) {
    return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${coords.lat},${coords.lon}`,
        key: 'AIzaSyBI_S0PtZF_qjsPhbqql5HlUoTj0pM5RYQ',
      },
    });
  };

  userLocService.getLocation = function () {
    const self = this;

    return new Promise((resolve, reject) => {
      self.getCoords()

      .then(coords => Promise.all([coords, self.getGeoCodeData(coords)]))

      .then((geocodeData) => {
        resolve(self.parseAddress(geocodeData));
      })

      .catch((error) => {
        reject(error);
      });
    });
  };

  userLocService.getLatLon = function (location) {
    return new Promise((resolve, reject) => {
      $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: 'AIzaSyBI_S0PtZF_qjsPhbqql5HlUoTj0pM5RYQ',
        },
      })

      .then((geocodeData) => {
        // handle cases where user input didn't yield any results
        if (geocodeData.data.status === 'ZERO_RESULTS') {
          reject(new Error('No Results'));
        }

        else {
          const coords = {};
          coords.lat = geocodeData.data.results[0].geometry.location.lat;
          coords.lon = geocodeData.data.results[0].geometry.location.lng;
          resolve(coords);
        }
      })

      .catch((error) => {
        reject(error);
      });
    });
  };

  return userLocService;
}]);
