angular
.module('home', [
  'header',
  'footer',
  'authService',
  'userLocService',
  'yelpService'
])
.component('appHome', {
  templateUrl: './common/home.template.html',
  controller: ['$scope', 'authService', 'userLocService', 'yelpService', function HomeController($scope, authService, userLocService, yelpService) {
    var self = this;

    self.inputLocation = 'Finding your location...';
    self.burgerJoints = null;

    self.getReviewStyle = function(rating){
      var style = {
        display: 'inline-block',
        width: '98px',
        height: '18px'
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
      }
      return style;
    };

    self.going = function(businessID){

    };

    //check for logged in state
    authService.getUser()
      .then(function(response){
        self.user = response.data;
      })
      .catch(function(err){
        self.user = null;
      });

    userLocService.getLocation()
      .then(function(location) {
        self.inputLocation = location.formattedAddress;
        $scope.$apply(); //trigger digest cycle to catch the asynchronous change to inputLocation
        return yelpService.getBurgerJoints(location.lat, location.lon);
      })

      .then(function(burgerJoints) {
        console.log(burgerJoints.data.businesses);
        self.burgerJoints = burgerJoints.data.businesses;
        $scope.$apply(); //trigger digest cycle to catch the asynchronous change to burgerJoints
      })

      .catch(function(error) {
        console.log(error);

        //check for geolocation errors
        if (error.occuredAt === 'getGeolocation' || error.occuredAt === 'getIP') {
          if (error.code === 1) {
            self.locationError = 'Enable location permissions to search by your location or type it in below.';
          } else if (error.code === 2) {
            self.locationError = 'Location unavilable. Please type it in below.';
          } else {
            self.locationError = 'Unable to get your location. Please type it in below.';
          }
        }

        //handle all other errors
        else {
          self.locationError = 'Please input your location below.';
        }

        //default ot Hamburg upon error
        self.inputLocation = 'Hamburg';
        $scope.$apply(); //trigger digest cycle to catch the asynchronous change to inputLocation
      });

  }]
});
