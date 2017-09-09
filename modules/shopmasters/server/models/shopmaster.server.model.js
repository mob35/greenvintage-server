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
    long: {
      type: String
    }
  },
  rate: {
    type: Number
  },
  review: [{
    rate: Number,
    comment: String,
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  }],
  historylog: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
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
