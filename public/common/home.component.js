angular
  .module('home', [
    'header',
    'footer',
  ])

.component('appHome', {
  templateUrl: './common/home.template.html',
  controller: [function HomeController(PollService) {
    var self = this;


  }]
});
