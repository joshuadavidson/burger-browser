const express = require('express');
const Business = require('../models/business.model');

const router = express.Router();

// check if request is authenticated
function ensureAuthenticated(req, res, next) {
  // request is authenticated go to next middleware
  if (req.isAuthenticated()) {
    next(null);
  }

  // request is not authenticated return 401
  else {
    res.sendStatus(401);
  }
}

router.get('', ensureAuthenticated, (req, res, next) => {
  Business.findOne({
    businessID: req.query.businessID,
  })

  .then((foundBusiness) => {
    // status OK
    res.status(200).json(foundBusiness);
  })

  .catch((findError) => {
    next(findError);
  });
});

// add an attendee to a business
router.put('', ensureAuthenticated, (req, res, next) => {
  const businessID = req.body.businessID;
  const userID = req.body.userID;

  Business.findOne({
    businessID,
  })

  .then((foundBusiness) => {
    // business already in db
    if (foundBusiness) {
      foundBusiness.addAttendee(userID);
      foundBusiness.save()
      .then((savedBusiness) => {
        // return created business
        res.status(200).json(savedBusiness);
      })
      .catch((saveError) => {
        // pass error to error handler
        next(saveError);
      });
    }

    // business not in db
    else {
      const newBusiness = new Business();
      newBusiness.addAttendee(userID);
      newBusiness.businessID = businessID;
      newBusiness.save()
      .then((savedBusiness) => {
        // created
        // return created business
        res.status(201).json(savedBusiness);
      })
      .catch((saveError) => {
        // pass error to error handler
        next(saveError);
      });
    }
  })

  .catch((findError) => {
    // pass error to error handler
    next(findError);
  });
});

// remove an attendee from a business
router.delete('', ensureAuthenticated, (req, res, next) => {
  const businessID = req.body.businessID;
  const userID = req.body.userID;

  Business.findOne({
    businessID,
  })

  .then((foundBusiness) => {
    // if business is found
    if (foundBusiness) {
      foundBusiness.removeAttendee(userID);
      foundBusiness.save()
      .then((savedBusiness) => {
        // return updated business
        res.status(200).json(savedBusiness);
      })
      .catch((saveError) => {
        // pass error to error handler
        next(saveError);
      });
    }
    // business not found
    else {
      // return empty business
      res.status(200).json(foundBusiness);
    }
  })

  .catch((findError) => {
    // pass error to error handler
    next(findError);
  });
});

module.exports = router;
