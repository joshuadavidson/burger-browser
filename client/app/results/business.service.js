/* establish global variables for ESLint */
/* global angular */

angular.module('businessService', []).factory('businessService', ['$window', '$http', function ($window, $http) {
  var businessService = {};

  businessService.getAttendees = function (businessID) {
    return new Promise(function (resolve, reject) {
      $http({
        method: 'GET',
        url: '/api/business',
        params: {
          businessID: businessID,
        }
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (getAttendeesError) {
        reject(getAttendeesError);
      });
    });
  };

  businessService.addAttendee = function (businessID, userID) {
    return new Promise(function (resolve, reject) {
      $http({
        method: 'PUT',
        url: '/api/business',
        data: {
          businessID: businessID,
          userID: userID,
        }
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (addAttendeeError) {
        reject(addAttendeeError);
      });
    });
  };

  businessService.removeAttendee = function (businessID, userID) {
    return new Promise(function (resolve, reject) {
      $http({
        method: 'DELETE',
        url: '/api/business',
        data: {
          businessID: businessID,
          userID: userID,
        },
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        }
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (removeAttendeeError) {
        reject(removeAttendeeError);
      });
    });
  };

  return businessService;
}]);
