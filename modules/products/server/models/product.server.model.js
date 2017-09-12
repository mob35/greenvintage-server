'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  detail: {
    type: String,
  },
  price: {
    type: Number,
    required: 'Please fill Product price'
  },
  promotionprice: {
    type: Number
  },
  percentofdiscount: {
    type: Number
  },
  currency: {
    type: String
  },
  images: {
    type: [String],
    required: 'Please fill Product images'
  },
  reviews: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Review'
    }]
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
