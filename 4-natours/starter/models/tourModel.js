// define schema
const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // specify the error if the field is missing
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'a tour must have a difficulty'],
    trim: true,
  },
  // this will be aggregated from user input review
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true, // trim the white space at the beginning and the end will be cut
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String, // just the name of the image, as a reference, usually leave the images in the file system.
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], // an array of type strings referencing the image array
  createdAt: {
    type: Date,
    default: Date.now(), // a timestamp in million seconds
    select: false, // hide this property from the client
  },
  startDates: [Date], // dates for an array of tour instances
});

// create the model out of the schema, use upper case for models
// models are fancier constructors complied from the schema definitions
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
