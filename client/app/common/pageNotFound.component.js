/* establish global variables for ESLint */
/* global angular */

angular
  .module('pageNotFound', [
    'header',
    'footer',
  ])

.component('appPageNotFound', {
  templateUrl: './app/common/pageNotFound.template.html',
  controller: [
    function PageNotFoundController() {
    },
  ],
});
