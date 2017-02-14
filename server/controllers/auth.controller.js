const express = require('express');
const passport = require('passport');

const router = express.Router();

// ***** FACEBOOK ***** //
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email',
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

// ***** TWITTER ***** //
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

// ***** GOOGLE ***** //
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

module.exports = router;
