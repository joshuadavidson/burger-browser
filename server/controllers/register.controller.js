const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user.model');

//register
router.post('', function(req, res, next) {
  passport.authenticate('local-register', function localRegisterVerifyCallback(err, user, info) {
    //pass errors to error handler
    if (err) {
      next(err);
    }

    //user already exists so can not register
    if (!user) {
      res.status(info.status).json({
        message: info.message //return message from passport auth
      });
    }

    //login user if no error and user object is returned
    if (!err && user) {
      req.login(user, function(err) {
        //any error from logging in is passed to error handler
        if (err) {
          next(err);
        }
        //successfully logged in
        res.status(info.status).json({
          message: info.message
        });
      });
    }

  })(req, res, next); //call the passport function
});

module.exports = router;
