const express = require('express');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  // check if request is authenticated
  if (req.isAuthenticated()) {
    next(null);
  }

  // request is not authenticated return 204 no content
  else {
    res.sendStatus(204);
  }
}

// return the user's profile information
router.get('', ensureAuthenticated, (req, res, next) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    provider: req.user.provider,
  });
});

module.exports = router;
