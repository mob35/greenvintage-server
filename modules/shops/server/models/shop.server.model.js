'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  topic: String,
  comment: String,
  rate: Number,
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Shop Schema
 */

var ShopSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Shop name',
    trim: true
  },
  detail: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  tel: {
    type: String,
    default: ''
  },
  map: {
    lat: {
      type: String
    },
    long: {
      type: String
    }
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

mongoose.model('Shop', ShopSchema);
mongoose.model('Review', ReviewSchema);
