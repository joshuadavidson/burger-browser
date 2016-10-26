angular
  .module('home', [
    'header',
    'footer',
    'UserLocation'
  ])

.component('appHome', {
  templateUrl: './common/home.template.html',
  controller: ['UserLocation', function HomeController(UserLocation) {
    var self = this;

    console.log(UserLocation.getCoords);

    UserLocation.getCoords.then(function(coords){
      self.inputLocation = coords.lat + ', '+ coords.lon;
    })
    .catch(function(error){
      self.locationError = 'Unable to get your location. Please type it in below.';
      self.inputLocation = {
        latitude: 53.5511,
        longitude: 9.9937
      };
    });

  }]
});
