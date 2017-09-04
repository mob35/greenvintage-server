'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cartmaster Schema
 */
var CartmasterSchema = new Schema({
  products: {
    type: [{
      product: {
        type: Schema.ObjectId,
        ref: 'Productmaster'
      },
      selectedsize: {
        type: String
      },
      itemamount: {
        type: Number
      },
      qty: {
        type: Number
      }
    }],
  },
  amount: {
    type: Number,
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

mongoose.model('Cartmaster', CartmasterSchema);
