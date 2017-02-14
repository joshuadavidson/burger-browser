const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user.model');

module.exports = function passportStrategies(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // **** LOCAL REGSITER **** //
  function localRegisterAuth(req, email, password, done) {
    // start by searching for user
    console.log('Searching for user');
    User.findOne({
      email,
    },
    (findError, user) => {
      // error from seraching the DB
      if (findError) {
        return done(findError);
      }

      // user already exists cannot register
      if (user) {
        console.log('Found User');
        return done(null, false, {
          status: 409,
          message: 'User already registered. Please login.',
        });
      }

      // user did not exist and needs to be created
      console.log('Creating new user.');
      const newUser = new User();
      newUser.name = req.body.name;
      newUser.email = email;
      newUser.provider = 'local';
      newUser.setPassword(password);
      newUser.save((saveError) => {
        // error in saving
        if (saveError) {
          return done(saveError);
        }

        // new user added
        return done(null, newUser, {
          status: 200,
          message: 'User registered.',
        });
      });
    });
  }

  const localRegisterStrategy = new LocalStrategy({
    // override passport default username field
    usernameField: 'email',
    passReqToCallback: true,
  }, localRegisterAuth);

  passport.use('local-register', localRegisterStrategy);

  // **** LOCAL LOGIN **** //
  function localLoginAuth(email, password, done) {
    // search for the user via email
    User.findOne({
      email,
    }, (findError, user) => {
      // error from searching the DB
      if (findError) {
        return done(findError);
      }

      // no user account found with email
      if (!user) {
        return done(null, false, {
          status: 404,
          message: 'Account with this email not registered.',
        });
      }

      // user object found but incorrect password
      if (!user.isValidPassword(password)) {
        return done(null, false, {
          status: 401,
          message: 'Please check your password.',
        });
      }

      // user found and password correct
      return done(null, user, {
        status: 200,
        message: 'User logged in.',
      });
    });
  }

  const localLoginStrategy = new LocalStrategy({
    // override passport default username field
    usernameField: 'email',
  }, localLoginAuth);

  passport.use('local-login', localLoginStrategy);

  // **** FACEBOOK **** //
  function facebookAuth(token, refreshToken, profile, done) {
    // start by searching for user
    console.log('Searching for Facebook user.');
    User.findOne({
      // search using unique providerId
      providerId: profile.id,
    }, (findError, user) => {
      // error from seraching the DB
      if (findError) {
        return done(findError);
      }
      // user already exists, log them in
      if (user) {
        console.log('Found Facebook user.');
        return done(null, user, {
          status: 200,
          message: 'User already exists.',
        });
      }
      // user did not exist and needs to be created
      console.log('Creating new Facebook user.');
      console.log(profile);
      const newUser = new User();
      newUser.name = `${profile.name.givenName} ${profile.name.familyName}`;
      newUser.email = profile.emails[0].value;
      newUser.provider = profile.provider;
      newUser.providerId = profile.id;
      newUser.save((saveError) => {
        // error in saving
        if (saveError) {
          return done(saveError);
        }
        // new user added
        console.log('New Facebook user created.');
        return done(null, newUser, {
          status: 200,
          message: 'User registered.',
        });
      });
    });
  }

  const facebookStrat = new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    // only grab needed fields from facebook
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  }, facebookAuth);

  passport.use(facebookStrat);

  // **** TWITTER **** //
  function twitterAuth(token, tokenSecret, profile, done) {
    // start by searching for user
    console.log('Searching for Twitter user.');
    User.findOne({
      // search using unique providerId
      providerId: profile.id,
    }, (findError, user) => {
      // error from seraching the DB
      if (findError) {
        return done(findError);
      }
      // user already exists, log them in
      if (user) {
        console.log('Found Twitter user.');
        return done(null, user, {
          status: 200,
          message: 'User already exists.',
        });
      }
      // user did not exist and needs to be created
      console.log('Creating new Twitter user.');
      const newUser = new User();
      newUser.name = profile.displayName;
      newUser.provider = profile.provider;
      newUser.providerId = profile.id;
      newUser.save((saveError) => {
        // error in saving
        if (saveError) {
          return done(saveError);
        }
        // new user added
        console.log('New Twitter user created.');
        return done(null, newUser, {
          status: 200,
          message: 'User registered.',
        });
      });
    });
  }

  const twitterStrat = new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
  }, twitterAuth);

  passport.use(twitterStrat);

  // **** GOOGLE **** //
  function googleAuth(token, tokenSecret, profile, done) {
    // start by searching for user
    console.log('Searching for Google user.');
    User.findOne({
      // search using unique providerId
      providerId: profile.id,
    }, (findError, user) => {
      // error from seraching the DB
      if (findError) {
        return done(findError);
      }
      // user already exists, log them in
      if (user) {
        console.log('Found Google user.');
        return done(null, user, {
          status: 200,
          message: 'User already exists.',
        });
      }
      // user did not exist and needs to be created
      console.log('Creating new Google user.');
      const newUser = new User();
      newUser.name = `${profile.name.givenName} ${profile.name.familyName}`;
      newUser.email = profile.emails[0].value;
      newUser.provider = profile.provider;
      newUser.providerId = profile.id;
      newUser.save((saveError) => {
        // error in saving
        if (saveError) {
          return done(saveError);
        }
        // new user added
        console.log('New Google user created.');
        return done(null, newUser, {
          status: 200,
          message: 'User registered.',
        });
      });
    });
  }

  const googleStrat = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  }, googleAuth);

  passport.use(googleStrat);
};
