const express = require('express');
const router = express.Router();
const request = require('request-promise-native');


var tokenRequestConfig = {
  method: 'POST',
  uri: 'https://api.yelp.com/oauth2/token',
  json: true,
  form: {
    'client_id': process.env.YELP_APP_ID,
    'client_secret': process.env.YELP_APP_SECRET
  }
};

//***** YELP *****//
//passthrough api endpoint that fetches data from Yelp
router.get('/burgerjoints', function(req, res, next) {
  request(tokenRequestConfig)

  .then(function(token) {
    var burgerJointsRequestConfig = {
      uri: 'https://api.yelp.com/v3/businesses/search',
      method: 'GET',
      qs: {
        categories: 'burgers',
        latitude: req.query.lat,
        longitude: req.query.lon,
        sort_by: 'rating',
        limit: 50
      },
      headers: {
        Authorization: 'Bearer ' + token.access_token
      }
    };

    //return a promise of the yelp api call
    return request(burgerJointsRequestConfig);
  })

  .then(function(burgerJoints) {
    res.json(JSON.parse(burgerJoints));
  })

  .catch(function(error) {
    res.json(JSON.parse(error));
  });
});

module.exports = router;
