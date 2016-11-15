const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const Business = require('../models/business.model');

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
//passthrough api endpoint that fetches data from Yelp and appends custom attendees data
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

  //take yelp JSON response and inject attendees into each business
  .then(function(burgerJoints) {
    var parsedBurgerJoints = JSON.parse(burgerJoints);
    var attendeePromises = [];

    for (index = 0; index < parsedBurgerJoints.businesses.length; index++){
      //add a mongoose DB lookup promise to array of promises
      attendeePromises.push(Business.findOne({businessID: parsedBurgerJoints.businesses[index].id}));
    }

    //add the parsed Burger Joints object to the end of the promise array for use locationError
    attendeePromises.push(parsedBurgerJoints);

    //simulatneously find attendees for all businesses
    return Promise.all(attendeePromises);

  })

  //take the attendee results and add them to the yelp Object then respond with the object
  .then(function(attendeeResults){
    //grab the parsed burger joints object from the end of the promise results array
    var parsedBurgerJoints = attendeeResults.pop();

    //sequentially add the attendee results to each business
    for (index = 0; index < attendeeResults.length; index++){
      //if the business has no attendees (null) then add blank array to business
      if(!attendeeResults[index]) {
        parsedBurgerJoints.businesses[index].attendees = [];
      }
      //if there are attendees then add them to the business
      //additionally append a key to denote user already attending if their ID is found in the attendee list
      else {
        parsedBurgerJoints.businesses[index].attendees = attendeeResults[index].attendees;
        //check if use is logged in, update only if they are
        if (req.user) {
          parsedBurgerJoints.businesses[index].userAttending = parsedBurgerJoints.businesses[index].attendees.includes(req.user._id.toString());
        }
      }
    }

    //respond with the updated burger joints object containing attendees data
    res.json(parsedBurgerJoints);
  })
  .catch(function(error) {
    res.json(JSON.parse(error));
  });
});

module.exports = router;
