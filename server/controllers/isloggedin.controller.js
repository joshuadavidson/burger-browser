const express = require('express');
const router = express.Router();

//return the logged in state of the user
router.get('', function(req, res, next) {
  res.json({
    status: req.isAuthenticated() ? true : false}
  );
});

module.exports = router;
