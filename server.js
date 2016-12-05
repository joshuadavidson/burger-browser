const express = require('express');
const app = express();
const dotenv = require('dotenv');
const passport = require('passport');
const configPassport = require('./config/passport'); //import the passport funciton containing configuration
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//Configure application
dotenv.config({
  silent: true, //supress .env file missing error
  path: './config/.env'
});
console.log('NODE_ENV is set to ' + process.env.NODE_ENV);
configPassport(passport); //run passport configuration
mongoose.Promise = Promise; //set mongoose to use ES6 promises

//Connect to database, log events
mongoose.connect(process.env.DB_URI);
mongoose.connection.on('connected', function onDBConnected(){
  console.log('Mongoose connected to DB at ' + process.env.DB_URI);
});
mongoose.connection.on('error', function onDBError(err){
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function onDBDisconnected(){
  console.log('Mongoose disconnected from DB');
});


// ********* MIDDLEWARE *********//
//compress server traffic
app.use(compression());

//serve static files to the client
app.use(express.static('public'));

//parse all request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//use express sessions
app.use(session({
  secret: 'this the burger browser',
  resave: false, //don't save unmodified sessions
  saveUninitialized: false, //dont create a session unless something is stored
  cookie: {
    maxAge: 604800000, //cookie expires after 1 week
  },
  store: new MongoStore({mongooseConnection: mongoose.connection}) //use MongoDB for session storage
}));


//use passport
app.use(passport.initialize());
app.use(passport.session());

//route api traffic
app.use('/api', require('./app/routes/api.routes'));

//send all url navigation traffic back to angular
app.get('/*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

// ******* END MIDDLEWARE *******//
//Basic Error handler
app.use(function(err, req,res, next){
  console.log('Server Error:');
  console.log(err);
});

app.listen(process.env.PORT, function() {
  console.log("Server started. Listening on port: " + process.env.PORT);
});
