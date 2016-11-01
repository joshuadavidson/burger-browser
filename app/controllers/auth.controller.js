const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const request = require('request');
const User = require('../models/user.model');

//***** FACEBOOK *****//
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

//***** TWITTER *****//
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

//***** GOOGLE *****//
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

//***** YELP *****//
router.get('/yelptoken', function (req, res, next){
  request.post({
    method: 'POST',
    uri: 'https://api.yelp.com/oauth2/token',
    json: true,
    form: {
      'client_id': process.env.YELP_APP_ID,
      'client_secret': process.env.YELP_APP_SECRET
    }
  },
  function yelpCallback(error, response, body){
    console.log(body);
    res.status(200).json({
      yelptoken: body.access_token
    });
  });
});

module.exports = router;
