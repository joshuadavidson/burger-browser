const express = require('express');
const passport = require('passport');

const router = express.Router();

// login
router.post('', (req, res, next) => {
  // custom local login function that handles local login success and failure
  function localLoginVerify(err, user, info) {
    // pass errors to error handler
    if (err) {
      next(err);
    }

    // wrong email or password
    if (!user) {
      res.status(info.status).json({
        // return message from passport auth
        message: info.message,
      });
    }

    // login user if no error, user found and password is valid
    if (!err && user) {
      req.login(user, (loginError) => {
        // any error from logging in is passed to error handler
        if (loginError) {
          next(loginError);
        }
        // successfully logged in
        res.status(info.status).json({
          message: info.message,
        });
      });
    }
  }

  // call the passport function for the local login attempt
  passport.authenticate('local-login', localLoginVerify)(req, res, next);
});

module.exports = router;
