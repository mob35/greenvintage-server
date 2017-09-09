'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shopmaster Schema
 */
var ShopmasterSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Shopmaster name',
    trim: true
  },
  detail: {
    type: String,
    trim: true
  },
  email: {
    type: String
  },
  tel: {
    type: String
  },
  image: {
    type: String
  },
  map: {
    lat: {
      type: String
    },
    lng: {
      type: String
    }
  },
  address: {
    type: [{
      address: {
        type: Schema.ObjectId,
        ref: 'Address'
      }
    }]
  },
  sellerSummary: {
    type: Number,
    default: 0
  },
  review: {
    type: [{
      user: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      comment: String,
      rate: Number
    }]
  },
  rate: Number,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Shopmaster', ShopmasterSchema);
