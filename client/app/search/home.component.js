/* establish global variables for ESLint */
/* global angular */

angular.module('burgerBrowser.home')

.component('bbHome', {
  templateUrl: './app/search/home.template.html',
  controller: ['$scope', '$window', 'authService', 'userLocService', 'yelpService', 'businessService', 'userService', function HomeController($scope, $window, authService, userLocService, yelpService, businessService, userService) {
    const self = this;

    // save the curent user from the user service
    self.user = userService.currentUser;

    // custom search with user input
    self.customSearch = function () {
      // clear data
      self.locationError = null;
      self.burgerJoints = null;
      $window.sessionStorage.removeItem('burgerJoints');

      // store the users input
      $window.sessionStorage.setItem('inputLocation', self.inputLocation);

      // use the location input to get lat lon
      userLocService.getLatLon(self.inputLocation)
      // use the lat lon to get burgerJoints
      .then(coords => yelpService.getBurgerJoints(coords.lat, coords.lon))

      .then((burgerJoints) => {
        // store the burgerJoints data
        self.burgerJoints = burgerJoints;
        $window.sessionStorage.setItem('burgerJoints', JSON.stringify(burgerJoints));
        // trigger digest cycle to catch the asynchronous change to burgerJoints
        $scope.$apply();
       })

      .catch((error) => {
        self.locationError = 'Sorry location not found. Please enter address, neighborhood, city, state or zip.';
        // trigger digest cycle to catch the error
        $scope.$apply();
      });
    };

    // style and sprite mapping for yelp reivew stars
    self.getReviewStyle = function (rating) {
      const style = {
        display: 'inline-block',
        width: '98px',
        height: '18px',
      };

      switch (rating) {
        case 0:
          style.background = "url('/img/yelpstars.png') 0px -360px";
          break;
        case 1:
          style.background = "url('/img/yelpstars.png') 0px -384px";
          break;
        case 1.5:
          style.background = "url('/img/yelpstars.png') 0px -408px";
          break;
        case 2:
          style.background = "url('/img/yelpstars.png') 0px -432px";
          break;
        case 2.5:
          style.background = "url('/img/yelpstars.png') 0px -456px";
          break;
        case 3:
          style.background = "url('/img/yelpstars.png') 0px -480px";
          break;
        case 3.5:
          style.background = "url('/img/yelpstars.png') 0px -504px";
          break;
        case 4:
          style.background = "url('/img/yelpstars.png') 0px -528px";
          break;
        case 4.5:
          style.background = "url('/img/yelpstars.png') 0px -552px";
          break;
        case 5:
          style.background = "url('/img/yelpstars.png') 0px -576px";
          break;
        // no default
      }
      return style;
    };

    // logged in user can mark that they are attending
    self.addAttendee = function (businessID, burgerJointIndex) {
      // toggle the button
      self.burgerJoints[burgerJointIndex].userAttending = true;
      // update the attendee data
      businessService.addAttendee(businessID, self.user._id)
        .then((business) => {
          self.burgerJoints[burgerJointIndex].attendees = business.attendees;
          // trigger digest cycle to catch the asynchronous change to burgerJoints
          $scope.$apply();
        })

        .catch((addAttendeeError) => {
          console.log(addAttendeeError);
        });
    };

    // logged in user can mark that they are no longer attending
    self.removeAttendee = function (businessID, burgerJointIndex) {
      // toggle the button
      self.burgerJoints[burgerJointIndex].userAttending = false;
      // update the attendee data
      businessService.removeAttendee(businessID, self.user._id)
        .then((business) => {
          self.burgerJoints[burgerJointIndex].attendees = business.attendees;
          // trigger digest cycle to catch the asynchronous change to burgerJoints
          $scope.$apply();
        })

        .catch((removeAttendeeError) => {
          console.log(removeAttendeeError);
        });
    };

    // use location to get inital list of burger joints
    self.locationSearch = function () {
      // clear data
      self.locationError = null;
      self.inputLocation = 'Finding your location...';
      self.burgerJoints = null;
      $window.sessionStorage.clear();

      userLocService.getLocation()
        // get user location
        .then((location) => {
          // store the inputLocation data
          self.inputLocation = location.formattedAddress;
          $window.sessionStorage.setItem('inputLocation', location.formattedAddress);
          // trigger digest cycle to catch the asynchronous change to inputLocation
          $scope.$apply();
          return yelpService.getBurgerJoints(location.lat, location.lon);
        })

      // use the location get burger joints
      .then((burgerJoints) => {
        // store the burgerJoints data
        self.burgerJoints = burgerJoints;
        $window.sessionStorage.setItem('burgerJoints', JSON.stringify(burgerJoints));
        // trigger digest cycle to catch the asynchronous change to burgerJoints
        $scope.$apply();
      })

      .catch((getLocationError) => {
        console.log(getLocationError);

        // check for geolocation errors
        if (getLocationError.occuredAt === 'getGeolocation' || getLocationError.occuredAt === 'getIP') {
          if (getLocationError.code === 1) {
            self.locationError = 'Enable location permissions to search by your location or type it in below.';
          }

          else if (getLocationError.code === 2) {
            self.locationError = 'Location unavilable. Please type it in below.';
          }

          else {
            self.locationError = 'Unable to get your location. Please type it in below.';
          }
        }

        // handle all other errors
        else {
          self.locationError = 'Please input your location below.';
        }

        // default ot Hamburg upon error
        self.inputLocation = 'Hamburg';
        // trigger digest cycle to catch the asynchronous change to inputLocation
        $scope.$apply();
      });
    };

    // check for previous data
    if ($window.sessionStorage.getItem('inputLocation') && $window.sessionStorage.getItem('burgerJoints')) {
      self.inputLocation = $window.sessionStorage.getItem('inputLocation');
      self.burgerJoints = JSON.parse($window.sessionStorage.getItem('burgerJoints'));
    }
    // no previous data--use defaults
    else {
      // default text box while loading data
      self.inputLocation = 'Finding your location...';
      // default list of burger joints while loading data
      self.burgerJoints = null;

      // get the data for the first time
      self.locationSearch();
    }
  }],
});
