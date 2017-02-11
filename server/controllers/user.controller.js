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

// return the user's information
router.get('', ensureAuthenticated, (req, res, next) => {
  res.json({
    user: {
      _id: req.user._id,
      createdAt: req.user.createdAt,
      email: req.user.email,
      name: req.user.name,
      provider: req.user.provider,
      updatedAt: req.user.updatedAt,
    }
  });
});

module.exports = router;
