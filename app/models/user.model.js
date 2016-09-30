const mongoose = require('mongoose');
const crypto = require('crypto');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    tirm: true
  },
  email: String,
  provider: {
    type: String,
    required: true
  },
  salt: String,
  hash: String,
}, {
  timestamps: true, //include created and updated timestamps
  retainKeyOrder: true //ensure that doc properties are saved in the order passed
});

//Set password for use in passport local Strategy
userSchema.methods.setPassword = function(password) {
  //create a random 16 byte hex salt
  this.salt = crypto.randomBytes(16).toString('hex');
  //use the salt and password to create a hash with keystretching
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
};

//Check password for us in passport local Strategy
userSchema.methods.isValidPassword = function(password) {
  //compare stored hash with hash of entered password
  return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
};

module.exports = mongoose.model('User', userSchema);
