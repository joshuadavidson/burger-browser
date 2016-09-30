const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').Strategy;
const User = require('../app/models/user.model');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //**** LOCAL ****//
  //Register a new local user
  passport.use('local-register', new LocalStrategy({
      usernameField: 'email', //override passport default username field
      passReqToCallback: true,
    },

    function localRegisterAuth(req, email, password, done) {
      //start by searching for user
      console.log('Searching for user');
      User.findOne({
        'email': email
      }, function(err, user) {
        //error from seraching the DB
        if (err) {
          return done(err);
        }

        //user already exists cannot register
        if (user) {
          console.log('Found User');
          return done(null, false, {
            status: 409,
            message: 'User already registered. Please login.'
          });
        }

        //user did not exist and needs to be created
        else {
          console.log('Creating new user.');
          var newUser = new User();
          newUser.name = req.body.name;
          newUser.email = email;
          newUser.provider = 'local';
          newUser.setPassword(password);
          newUser.save(function(err) {
            //error in saving
            if (err) {
              throw err;
            }

            //new user added
            return done(null, newUser, {
              status: 200,
              message: 'User registered.'
            });
          });
        }
      });
    }
  ));

  //login a local user
  passport.use('local-login', new LocalStrategy({
      usernameField: 'email', //override passport default username field
    },

    function localLoginAuth(email, password, done) {
      //search for the user via email
      User.findOne({
        'email': email
      }, function(err, user) {
        //error from searching the DB
        if (err) {
          return done(err);
        }

        //no user account found with email
        if (!user) {
          return done(null, false, {
            status: 404,
            message: 'Account with this email not registered.'
          });
        }

        //user object found but incorrect password
        if (!user.isValidPassword(password)) {
          return done(null, false, {
            status: 401,
            message: 'Please check your password.'
          });
        }

        //user found and password correct
        return done(null, user, {
          status: 200,
          message: 'User logged in.'
        });

      });
    }
  ));

  //**** FACEBOOK ****//

  passport.use(new FacebookStrategy({
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL,
      profileFields: ['id', 'email', 'first_name', 'last_name'] //only grab needed fiels from facebook
    },

    function facebookAuth(token, refreshToken, profile, done) {
      //start by searching for user
      console.log('Searching for FB user');
      User.findOne({
        'providerId': profile.id //search using unique providerId
      }, function(err, user) {
        //error from seraching the DB
        if (err) {
          return done(err);
        }

        //user already exists, log them in
        if (user) {
          console.log('Found FB User');
          return done(null, user, {
            status: 200,
            message: 'User logged in.'
          });
        }

        //user did not exist and needs to be created
        else {
          console.log('Creating new FB user.');
          var newUser = new User();
          newUser.name = profile.name.givenName + ' ' + profile.name.failyName;
          newUser.email = profile.emails[0].value;
          newUser.providerId = profile.id;
          newUser.save(function(err) {
            //error in saving
            if (err) {
              throw err;
            }

            //new user added
            return done(null, newUser, {
              status: 200,
              message: 'User registered.'
            });

          });
        }
      });
    }

  ));

  //**** TWITTER ****//

  //**** GOOGLE ****//

};
