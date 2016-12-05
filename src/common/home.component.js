import angular from 'angular';
import header from './header.component';
import footer from './footer.component';
import authServiceMod from '../auth/auth.service';
import userLocServiceMod from './userloc.service';
import yelpServiceMod from './yelp.service';
import businessServiceMod from './business.service';

export default angular.module('home', [
  header,
  footer,
  authServiceMod,
  userLocServiceMod,
  yelpServiceMod,
  businessServiceMod,
])
.component('appHome', {
  templateUrl: './common/home.template.html',
  controller: ['$scope', '$window', 'authService', 'userLocService', 'yelpService', 'businessService', function HomeController($scope, $window, authService, userLocService, yelpService, businessService) {
    const self = this;

    //  custom search with user input
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
        self.burgerJoints = burgerJoints.data.businesses;
        $window.sessionStorage.setItem('burgerJoints', JSON.stringify(burgerJoints.data.businesses));
        $scope.$apply(); // trigger digest cycle to catch the asynchronous change to burgerJoints
      })

      .catch((error) => {
        console.log('Custom search error:');
        console.log(error.message);
        self.locationError = 'Sorry location not found. Please enter address, neighborhood, city, state or zip.';
        $scope.$apply(); // trigger digest cycle to catch the error
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
        default:
          break;
      }
      return style;
    };

    // logged in user can mark that they are attending
    self.addAttendee = function (businessID, burgerJointIndex) {
      // toggle the button
      self.burgerJoints[burgerJointIndex].userAttending = true;
      // update the attendee data
      businessService.addAttendee(businessID, self.user._id)
        .then(function (business) {
          self.burgerJoints[burgerJointIndex].attendees = business.attendees;
          $scope.$apply(); // trigger digest cycle to catch the asynchronous change to burgerJoints
        })

      .catch(function (error) {
        console.log(error);
      });
    };

    // logged in user can mark that they are no longer attending
    self.removeAttendee = function (businessID, burgerJointIndex) {
      // toggle the button
      self.burgerJoints[burgerJointIndex].userAttending = false;
      // update the attendee data
      businessService.removeAttendee(businessID, self.user._id)
        .then(function (business) {
          self.burgerJoints[burgerJointIndex].attendees = business.attendees;
          $scope.$apply(); // trigger digest cycle to catch the asynchronous change to burgerJoints
        })

      .catch(function (error) {
        console.log(error);
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
        .then(function (location) {
          // store the inputLocation data
          self.inputLocation = location.formattedAddress;
          $window.sessionStorage.setItem('inputLocation', location.formattedAddress);
          $scope.$apply(); // trigger digest cycle to catch the asynchronous change to inputLocation
          return yelpService.getBurgerJoints(location.lat, location.lon);
        })

      // use the location get burger joints
      .then(function (burgerJoints) {
        // store the burgerJoints data
        self.burgerJoints = burgerJoints.data.businesses;
        $window.sessionStorage.setItem('burgerJoints', JSON.stringify(burgerJoints.data.businesses));
        $scope.$apply(); // trigger digest cycle to catch the asynchronous change to burgerJoints
      })

      .catch(function (error) {
        console.log(error);

        // check for geolocation errors
        if (error.occuredAt === 'getGeolocation' || error.occuredAt === 'getIP') {
          if (error.code === 1) {
            self.locationError = 'Enable location permissions to search by your location or type it in below.';
          } else if (error.code === 2) {
            self.locationError = 'Location unavilable. Please type it in below.';
          } else {
            self.locationError = 'Unable to get your location. Please type it in below.';
          }
        } else { // handle all other errors
          self.locationError = 'Please input your location below.';
        }

        // default ot Hamburg upon error
        self.inputLocation = 'Hamburg';
        $scope.$apply(); // trigger digest cycle to catch the asynchronous change to inputLocation
      });
    };

    // check for logged in state
    authService.getUser()
    .then(function (response) {
      self.user = response.data;
    })
    .catch(function (err) {
      self.user = null;
    });

    // check for previous data
    if ($window.sessionStorage.getItem('inputLocation') && $window.sessionStorage.getItem('burgerJoints')) {
      self.inputLocation = $window.sessionStorage.getItem('inputLocation');
      self.burgerJoints = JSON.parse($window.sessionStorage.getItem('burgerJoints'));
    } else { // no previous data--use defaults
      // default text box while loading data
      self.inputLocation = 'Finding your location...';
      // default list of burger joints while loading data
      self.burgerJoints = null;

      // get the data for the first time
      self.locationSearch();
    }
  }],
}).name;
