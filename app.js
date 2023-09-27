// Import required modules and packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv/config'); // Load environment variables from a .env file

// Import route handlers
const indexRouter = require('./routes/index');
const galleryRouter = require('./routes/gallery');
const loginRouter = require('./routes/login');
const seamasgalleryRouter = require('./routes/seamasgallery');

var app = express();

// Configure view engine and view folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up session handling and body parsing
app.use(session({ secret: process.env.SESSION_SECRET, saveUninitialized: false, resave: false }));
app.use(bodyParser.urlencoded({ extended: true }));

// Configure request logging and JSON parsing
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for different parts of the application
app.use('/', indexRouter);       // Root route
app.use('/gallery', galleryRouter); // Gallery route
app.use('/login', loginRouter);   // Login route
app.use('/seamasgallery', seamasgalleryRouter);

// Handle 404 errors by forwarding to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler middleware
app.use(function(err, req, res, next) {
  // Set locals to provide error details in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Establish a MongoDB connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database Connected');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app; // Export the express application
