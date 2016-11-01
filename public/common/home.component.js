angular
  .module('home', [
    'header',
    'footer',
    'UserLocation',
    'Yelp'
  ])

.component('appHome', {
  templateUrl: './common/home.template.html',
  controller: ['$scope', 'UserLocation', 'Yelp', function HomeController($scope, UserLocation, Yelp) {
    var self = this;

    self.inputLocation = 'Finding your location...';

    UserLocation.getLocation()
    .then(function(location){
      self.inputLocation = location.formattedAddress;
      $scope.$apply(); //trigger digest cycle to catch the asynchronous change to inputLocation
      return Yelp.getBurgerJoints(location.lat, location.lon);
    })

    .then(function(results){
      console.log(results);
    })

    .catch(function(error){
      console.log(error);
      self.locationError = 'Unable to get your location. Please type it in below.';
      self.inputLocation = 'Hamburg';
      $scope.$apply(); //trigger digest cycle to catch the asynchronous change to inputLocation
    });



  }]
});
