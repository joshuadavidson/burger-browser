import angular from 'angular';

export default angular
  .module('footer', [])
  .component('appFooter', {
    templateUrl: './common/footer.template.html',
    controller: [function FooterController() {}],
  }).name;
