import angular from 'angular';

export default angular
  .module('pageNotFound', [
    'header',
    'footer',
  ])

.component('appPageNotFound', {
  templateUrl: './common/pageNotFound.template.html',
  controller: [
    function PageNotFoundController() {
      var self = this;

    }
  ]
}).name;
