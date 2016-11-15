const express = require('express');
const router = express.Router();
const Business = require('../models/business.model');

//check if request is authenticated
function ensureAuthenticated(req, res, next) {
  //request is authenticated go to next middleware
  if (req.isAuthenticated()) {
    return next(null);
  }

  //request is not authenticated return 401
  else {
    res.sendStatus(401);
  }
}

router.get('', ensureAuthenticated, function(req, res, next) {
  Business.findOne({
    businessID: req.query.businessID
  })

  .then(function(business){
    res.status(200); //status OK
    res.json(business);
  })

  .catch(function(error){
    next(err);
  });
});

//add an attendee to a business
router.put('', ensureAuthenticated, function(req, res, next) {
  var businessID = req.body.businessID;
  var userID = req.body.userID;

  Business.findOne({
    businessID: businessID
  })

  .then(function(business){
    //business already in db
    if(business){
      business.addAttendee(userID);
      business.save().then(function(business){
        res.status(200);
        res.json(business); //return created business
      })
      .catch(function(error) {
        next(error); //pass error to error handler
      });
    }

    //business not in db
    else {
      var newBusiness = new Business();
      newBusiness.addAttendee(userID);
      newBusiness.businessID = businessID;
      newBusiness.save().then(function(business){
        res.status(201); //created
        res.json(business); //return created business
      })
      .catch(function(error) {
        next(error); //pass error to error handler
      });
    }
  })

  .catch(function(error){
    next(error); //pass error to error handler
  });
});

//remove an attendee from a business
router.delete('', ensureAuthenticated, function(req, res, next) {
  var businessID = req.body.businessID;
  var userID = req.body.userID;

  Business.findOne({
    businessID: businessID
  })

  .then(function(business){
    //if business is found
    if(business){
      business.removeAttendee(userID);
      business.save().then(function(business){
        res.status(200);
        res.json(business); //return updated business
      })
      .catch(function(error){
        next(error); //pass error to error handler
      });
    }
    //business not found
    else {
      res.status(200);
      res.json(business); //return created business
    }
  })

  .catch(function(error){
    next(error); //pass error to error handler
  });
});

module.exports = router;
