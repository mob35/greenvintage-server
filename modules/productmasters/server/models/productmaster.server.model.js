'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Productmaster Schema
 */
var ProductmasterSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill Productmaster name'
  },
  detail: {
    type: String
  },
  price: {
    type: Number,
    required: 'Please fill Product price'
  },
  image: {
    required: 'Please fill Product image',
    type: [{
      id: String,
      url: String
    }]
  },
  preparedays: {
    type: Number
  },
  favorite: {
    type: [{
      user: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  historylog: {
    type: [{
      user: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  shop: {
    required: 'Please fill Product shopseller',
    type: Schema.ObjectId,
    ref: 'Shopmaster'
  },
  shippings: {
    required: 'Please fill Product shippings',
    type: [{
      shipping: {
        type: Schema.ObjectId,
        ref: 'Shippingmaster'
      }
    }]
  },
  issize: {
    type: Boolean
  },
  size: {
    type: Schema.ObjectId,
    ref: 'Sizemaster'
  },
  sellerlog: {
    type: [{
      user: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      },
      qty: Number
    }]
  },
  sellerSummary: {
    type: Number,
    default: 0
  },
  category: {
    required: 'Please fill Product category',
    type: Schema.ObjectId,
    ref: 'Categorymaster'
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

mongoose.model('Productmaster', ProductmasterSchema);
