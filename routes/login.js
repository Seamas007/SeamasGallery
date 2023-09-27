const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const schemas = require('../models/schemas.js');

// GET request for the login page
router.get('/', (req, res) => {
  res.render('login', { title: 'Login', loggedIn: false, error: null });
});

// GET request for the new account registration page
router.get('/new-acct', (req, res) => {
  res.render('new-acct', { title: 'New Account', loggedIn: false, error: null });
});

// POST request for user login
router.post('/', async (req, res) => {
  let email = req.body.emailInput;
  let pass = req.body.pwdInput;
  let loginSuccess = false;
  let sesh = req.session;
  sesh.loggedIn = false;

  let users = schemas.users;
  let qry = { email: email };

  if (email != '' && pass != '') {
    // Find the user account using the provided email
    let usersResult = await users.findOne(qry).then(async (data) => {
      if (data) {
        // Check if the provided password matches the stored hashed password
        let passResult = await bcrypt.compare(pass, data.pwd).then((isMatch) => {
          if (isMatch) {
            // Login is successful - set the session to indicate the user is logged in
            sesh.loggedIn = true;
            loginSuccess = true;
          }
        });
      }
    });
  }

  if (loginSuccess === true) {
    res.redirect('/');
  } else {
    res.render('login', { title: 'Login', loggedIn: false, error: 'Invalid Login!' });
  }
});

// POST request for creating a new user account
router.post('/new', async (req, res) => {
  let email = req.body.emailInput;
  let pass = req.body.pwdInput;

  if (email != '' && pass != '') {
    let users = schemas.users;
    let qry = { email: email };

    let userSearch = await users.findOne(qry).then(async (data) => {
      if (!data) {
        // Password encryption
        let saltRounds = 10;
        let passSalt = await bcrypt.genSalt(saltRounds, async (err, salt) => {
          let passHash = await bcrypt.hash(pass, salt, async (err, hash) => {
            let acct = { email: email, pwd: hash, level: 'admin' };
            let newUser = new schemas.users(acct);
            let saveUser = await newUser.save();
          });
        });
      }
    });

    res.render('login', { title: 'Login', loggedIn: false, error: 'Please login with your new account' });
  } else {
    res.render('new-acct', { title: 'New Account', loggedIn: false, error: 'All fields are required. Please check and try again.' });
  }
});

module.exports = router; // Export the router for use in other parts of the application
