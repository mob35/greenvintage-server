'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ordermaster Schema
 */
var OrdermasterSchema = new Schema({
  shipping: {
    type: Schema.ObjectId,
    ref: 'Address'
  },
  items: [{
    product: {
      type: Schema.ObjectId,
      ref: 'Productmaster'
    },
    qty: Number,
    amount: Number,
    size: String,
    status: {
      type: String,
      enum: ['waiting', 'accept', 'reject', 'unreceived', 'received'],
      default: 'waiting'
    },
    delivery: {
      type: Schema.ObjectId,
      ref: 'Shippingmaster'
    },
  }],
  payment: {
    paymenttype: String,
    creditno: String,
    creditname: String,
    expdate: String,
    creditcvc: String,
    counterservice: String
  },
  amount: Number,
  discount: Number,
  totalamount: Number,
  status: {
    type: String,
    enum: ['confirm', 'paid', 'prepare', 'deliver', 'complete', 'cancel'],
    default: 'confirm'
  },
  cart: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Ordermaster', OrdermasterSchema);
