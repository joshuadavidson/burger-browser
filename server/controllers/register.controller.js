const express = require('express');
const passport = require('passport');

const router = express.Router();

// register
router.post('', (req, res, next) => {
  // custom local register function that handles local regsiter success and failure
  function localRegisterVerify(err, user, info) {
    // pass errors to error handler
    if (err) {
      next(err);
    }

    // user already exists so can not register
    if (!user) {
      res.status(info.status).json({
        // return message from passport auth
        message: info.message,
      });
    }

    // login user if no error and user object is returned
    if (!err && user) {
      req.login(user, (loginError) => {
        // any error from logging in is passed to error handler
        if (loginError) {
          next(loginError);
        }
        // successfully logged in
        res.status(info.status).json({
          user: {
            _id: user._id,
            createdAt: user.createdAt,
            email: user.email,
            name: user.name,
            provider: user.provider,
            updatedAt: user.updatedAt,
          },
        });
      });
    }
  }

  // call the passport function for the local register attempt
  passport.authenticate('local-register', localRegisterVerify)(req, res, next);
});

module.exports = router;
