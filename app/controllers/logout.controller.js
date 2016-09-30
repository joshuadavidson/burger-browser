const express = require('express');
const router = express.Router();

//remove the session when logging out
router.get('', function(req, res, next) {
  req.logout();
  res.status(200).json({
    message: 'User successfully logged out.'
  });
});

module.exports = router;
