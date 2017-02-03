/* establish global variables for ESLint */
/* global angular */

angular
  .module('footer', [])
  .component('appFooter', {
    templateUrl: './app/common/footer.template.html',
    controller: [function FooterController(){}],
  });
