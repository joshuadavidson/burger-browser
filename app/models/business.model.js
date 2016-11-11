const mongoose = require('mongoose');

var businessSchema = new mongoose.Schema({
  businessID: { //yelp business id
    type: String,
    required: true,
    trim: true
  },
  attendees: [String], //array of attendees
}, {
  timestamps: true, //include created and updated timestamps
  retainKeyOrder: true //ensure that doc properties are saved in the order passed
});

//Set password for use in passport local Strategy
businessSchema.methods.addAttendee = function(userID) {
  if(!this.attendees.includes(userID)){
    this.attendees.push(userID);
  }
};

businessSchema.methods.attendeeExists = function(userID) {
  return this.attendees.includes(userID);
};

businessSchema.methods.removeAttendee = function(userID) {
  //find the index of the userID within attendees
  var index = this.attendees.findIndex(function(element){
    return element === userID;
  });

  //if found remove it
  if(index > -1){
    this.attendees.splice(index, 1);
  }
};

businessSchema.methods.clearAttendees = function() {
  //reset the attendees list
  this.attendees = [];
};


module.exports = mongoose.model('Business', businessSchema);
