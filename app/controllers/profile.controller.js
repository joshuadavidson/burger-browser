const express = require('express');
const router = express.Router();

function ensureAuthenticated(req, res, next) {
  //check if request is authenticated
  if (req.isAuthenticated()) {
    return next(null);
  }

  //request is not authenticated return 401
  else {
    res.sendStatus(204);
  }
}

//return the user's profile information
router.get('', ensureAuthenticated, function(req, res, next) {
  res.json({
    _id: req.user._id,
    sessionID: req.sessionID,
    name: req.user.name,
    email: req.user.email,
    provider: req.user.provider
  });
});

module.exports = router;
