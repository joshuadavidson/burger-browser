const express = require('express');
const router = express.Router();

//api routes /api/ROUTE
router.use('/register', require('../controllers/register.controller'));
router.use('/login', require('../controllers/login.controller'));
router.use('/logout', require('../controllers/logout.controller'));
router.use('/isloggedin', require('../controllers/isloggedin.controller'));
router.use('/profile', require('../controllers/profile.controller'));

module.exports = router;
