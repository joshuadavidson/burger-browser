const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user.model');


router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', function(req, res, next){

});

module.exports = router;
