/* establish global variables for ESLint */
/* global angular */

angular.module('common.telephone.filter', []).filter('telephone', function () {
  var telephoneFilter = function telephoneFilter(telephoneNum) {
    // clean up the input to be only numbers
    var numOnly = telephoneNum.replace(/\D/, '');
    var number = void 0;
    var countryCode = void 0;
    var areaCode = void 0;

    // check for null value
    if (!telephoneNum) {
      return '';
    }

    // single digit country code given for US numbers
    if (numOnly.length === 11) {
      // drop country code if it is 1
      if (numOnly.slice(0, 1) === '1') {
        countryCode = '';
      } else {
        countryCode = numOnly.slice(0, 1);
      }

      number = numOnly.slice(4);
      areaCode = numOnly.slice(1, 4);
      return countryCode + ' (' + areaCode + ') ' + number.slice(0, 3) + '-' + number.slice(3);
    }

    // return the number if it is international
    return telephoneNum;
  };

  return telephoneFilter;
});
