const express = require('express');
const router = express.Router();

function ensureAuthenticated(req, res, next) {
  //check if request is authenticated
  if (req.isAuthenticated()) {
    console.log('Authenticated');
    return next(null);
  }

  //request is not authenticated return 401
  else {
    console.log('Not Authenticated');
    res.status(401);
  }
}

//return the user's profile information
router.get('', ensureAuthenticated, function(req, res, next) {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    provider: req.user.provider
  });
});

module.exports = router;
