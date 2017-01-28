const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  // yelp business id
  businessID: {
    type: String,
    required: true,
    trim: true,
  },
  // array of attendees
  attendees: [String],
}, {
  // include created and updated timestamps
  timestamps: true,
  // ensure that doc properties are saved in the order passed
  retainKeyOrder: true,
});

// Set password for use in passport local Strategy
businessSchema.methods.addAttendee = function (userID) {
  if (!this.attendees.includes(userID)) {
    this.attendees.push(userID);
  }
};

businessSchema.methods.attendeeExists = function (userID) {
  return this.attendees.includes(userID);
};

businessSchema.methods.removeAttendee = function (userID) {
  // find the index of the userID within attendees
  const index = this.attendees.findIndex(element => element === userID);

  // if found remove it
  if (index > -1) {
    this.attendees.splice(index, 1);
  }
};

businessSchema.methods.clearAttendees = function () {
  // reset the attendees list
  this.attendees = [];
};

module.exports = mongoose.model('Business', businessSchema);
