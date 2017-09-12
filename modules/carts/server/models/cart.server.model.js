'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cart Schema
 */
var CartSchema = new Schema({
  items: {
    type: [{
      product: {
        type: Schema.ObjectId,
        ref: 'Product'
      },
      qty: {
        type: Number
      },
      amount: {
        type: Number
      },
      discount: {
        type: Number
      },
      totalamount: {
        type: Number
      }
    }]
  },
  amount: {
    type: Number
  },
  discount: {
    type: Number
  },
  totalamount: {
    type: Number
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

mongoose.model('Cart', CartSchema);
