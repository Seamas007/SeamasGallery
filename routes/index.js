const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas.js');

// GET request for the home page
router.get('/', async (req, res) => {
  let gallery = schemas.gallery;
  let sesh = req.session;

  // Retrieve gallery data from the database and render the home page
  let galleryResult = await gallery.find({}).then((galleryData) => {
    res.render('index', { title: 'Art Gallery App', data: galleryData, search: '', loggedIn: sesh.loggedIn });
  });
});

// GET request to log out the user
router.get('/logout', (req, res) => {
  // Destroy the session and redirect to the home page
  req.session.destroy();
  res.redirect('/');
});

// POST request to search for gallery items
router.post('/q', async (req, res) => {
  let gallery = schemas.gallery;
  let q = req.body.searchInput;
  let galleryData = null;
  let sesh = req.session;
  let qry = { name: { $regex: '^' + q, $options: 'i' } };

  if (q != null) {
    // Search for gallery items that match the query and render the results
    let galleryResult = await gallery.find(qry).then((data) => {
      galleryData = data;
    });
  } else {
    // If no search query is provided, retrieve all gallery items and render the home page
    q = 'search';
    let galleryResult = await gallery.find({}).then((data) => {
      galleryData = data;
    });
  }

  res.render('index', { title: 'Art Gallery App', data: galleryData, search: q, loggedIn: sesh.loggedIn });
});

module.exports = router; // Export the router for use in other parts of the application
