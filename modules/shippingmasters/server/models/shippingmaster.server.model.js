'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shippingmaster Schema
 */
var ShippingmasterSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill Shippingmaster name'
  },
  detail: {
    type: String,
    required: 'Please fill Shippingmaster detail'
  },
  days: {
    type: Number,
    required: 'Please fill Shippingmaster days'
  },
  price: {
    type: Number,
    required: 'Please fill Shippingmaster price'
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

mongoose.model('Shippingmaster', ShippingmasterSchema);
