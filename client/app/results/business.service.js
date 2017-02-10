/* establish global variables for ESLint */
/* global angular */

angular
.module('businessService', [])

.factory('businessService', ['$window', '$http', function ($window, $http) {
  const businessService = {};

  businessService.getAttendees = function (businessID) {
    return new Promise((resolve, reject) => {
      $http({
        method: 'GET',
        url: '/api/business',
        params: {
          businessID,
        },
      })

      .then((response) => {
        resolve(response.data);
      })

      .catch((getAttendeesError) => {
        reject(getAttendeesError);
      });
    });
  };

  businessService.addAttendee = function (businessID, userID) {
    return new Promise((resolve, reject) => {
      $http({
        method: 'PUT',
        url: '/api/business',
        data: {
          businessID,
          userID,
        },
      })

      .then((response) => {
        resolve(response.data);
      })

      .catch((addAttendeeError) => {
        reject(addAttendeeError);
      });
    });
  };

  businessService.removeAttendee = function (businessID, userID) {
    return new Promise((resolve, reject) => {
      $http({
        method: 'DELETE',
        url: '/api/business',
        data: {
          businessID,
          userID,
        },
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })

      .then((response) => {
        resolve(response.data);
      })

      .catch((removeAttendeeError) => {
        reject(removeAttendeeError);
      });
    });
  };

  return businessService;
}]);
