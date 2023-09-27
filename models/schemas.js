const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Define the schema for the gallery collection
let gallerySchema = new schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    galleryUrl: { type: String, required: true },
    entryDate: { type: Date, default: Date.now }
}); 

// Define the schema for the users collection
let usersSchema = new schema({
    email: { type: String, required: true },
    pwd: { type: String, required: true },
    entryDate: { type: Date, default: Date.now }
});

// Create models from the schemas and specify the collection names
let gallery = mongoose.model('gallery', gallerySchema, 'gallery');
let users = mongoose.model('users', usersSchema, 'users');

// Create an object that holds references to the defined models
let mySchemas = { 'gallery': gallery, 'users': users };

// Export the object containing the models for use in other parts of the application
module.exports = mySchemas;
