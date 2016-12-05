import angular from 'angular';

export default angular.module('burgerBrowser').filter('telephone', function() {
  return function(telephoneNum) {
    //check for null value
    if (!telephoneNum) {
      return '';
    }

    //clean up the input to be only numbers
    var numOnly = telephoneNum.replace(/\D/, '');
    var countryCode;
    var areaCode;
    var subscriberNumber;

    //single digit country code given for US numbers
    if (numOnly.length === 11) {
      //drop country code if it is 1
      if (numOnly.slice(0,1)==='1'){
        countryCode = '';
      } else {
        countryCode = numOnly.slice(0, 1);
      }
      areaCode = numOnly.slice(1, 4);
      number = numOnly.slice(4);
      return countryCode + ' (' + areaCode + ') ' + number.slice(0, 3) + '-' + number.slice(3);
    }

    //return the number if it is international
    else {
      return telephoneNum;
    }

  };
}).name;
