const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const schemas = require('../models/schemas.js');

// GET request to the home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET request to view/edit a specific item by ID
router.get('/:id', async (req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.render('gallery', { title: 'Edit', loggedIn: false, error: 'Invalid Request' });
    } else {
        let id = req.params.id;
        let err = '';

        let gallery = schemas.gallery;
        let qry = { _id: id };

        let itemResult = await gallery.find(qry).then((itemData) => {
            if (itemData == null) {
                err = 'Invalid ID';
            }

            res.render('gallery', { title: 'Edit gallery', item: itemData, loggedIn: sesh.loggedIn, error: err });
        });
    }
});

// GET request to delete an item by ID
router.get('/delete/:id', async (req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        let gallery = schemas.gallery;
        let galleryId = req.params.id;
        let qry = { _id: galleryId };
        let deleteResult = await gallery.deleteOne(qry);
        res.redirect('/');
    }
});

// POST request to save changes to an item
router.post('/save', async (req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        let galleryId = req.body.galleryId;
        let galleryName = req.body.galleryName;
        let galleryIcon = req.body.galleryIcon;
        let galleryUrl = req.body.galleryUrl;
        let gallery = schemas.gallery;

        let qry = { _id: galleryId };

        let saveData = {
            $set: {
                name: galleryName,
                icon: galleryIcon,
                galleryUrl: galleryUrl
            }
        }

        let updateResult = await gallery.updateOne(qry, saveData);

        res.redirect('/');
    }
});

// POST request to create a new item
router.post('/new', async (req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        let galleryName = req.body.galleryName;
        let galleryIcon = req.body.galleryIcon;
        let galleryUrl = req.body.galleryUrl;
        let gallery = schemas.gallery;

        let qry = { name: galleryName };

        let searchResults = await gallery.findOne(qry).then(async (userData) => {
            if (!userData) {
                // OK to add gallery
                let newGallery = new schemas.gallery({
                    name: galleryName,
                    icon: galleryIcon,
                    galleryUrl: galleryUrl
                });

                let saveGallery = await newGallery.save();
            }
        });

        res.redirect('/');
    }
});

module.exports = router; // Export the router for use in other parts of the application
