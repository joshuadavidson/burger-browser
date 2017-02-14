const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// import the passport function containing configuration
const configPassport = require('./config/passport');

const app = express();

// Configure application
dotenv.config({
  // suppress .env file missing error
  silent: true,
  path: './server/config/.env',
});

console.log(`NODE_ENV is set to ${process.env.NODE_ENV}`);

// run passport configuration
configPassport(passport);


// ********* DB CONNECTION *********//
// set mongoose to use ES6 promises
mongoose.Promise = Promise;

function onDBConnected() {
  console.log(`Mongoose connected to DB at ${process.env.DB_URI}`);
}

function onDBError(err) {
  console.log(`Mongoose connection error: ${err}`);
}

function onDBDisconnected() {
  console.log('Mongoose disconnected from DB');
}
// Connect to database, log events
mongoose.connect(process.env.DB_URI);
mongoose.connection.on('connected', onDBConnected);
mongoose.connection.on('error', onDBError);
mongoose.connection.on('disconnected', onDBDisconnected);
// ********* END DB CONNECTION *********//


// ********* MIDDLEWARE *********//
// compress server traffic
app.use(compression());

// serve static files to the client
app.use(express.static(path.join(__dirname, '../client')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

// parse all request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

// use express sessions
app.use(session({
  secret: 'this the burger browser',
  // don't save unmodified sessions
  resave: false,
  // dont create a session unless something is stored
  saveUninitialized: false,
  cookie: {
    // cookie expires after 1 week
    maxAge: 604800000,
  },
  // use MongoDB for session storage
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));

// use passport
app.use(passport.initialize());
app.use(passport.session());

// route api traffic
app.use('/api', require('./routes/api.routes'));

// send all url navigation traffic back to angular
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});
// ******* END MIDDLEWARE *******//


// Basic Error handler
app.use((err, req, res, next) => {
  console.log('Server Error:');
  console.log(err);
  res.status(500);
});

app.listen(process.env.PORT, () => {
  console.log(`Server started. Listening on port: ${process.env.PORT}`);
});
