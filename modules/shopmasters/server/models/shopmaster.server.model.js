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
    customerid: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    historydate: {
      type: Date,
      default: Date.now
    }
  }],
  // address: {
  //   type: [{
  //     address: {
  //       type: Schema.ObjectId,
  //       ref: 'Address'
  //     }
  //   }]
  // },
  // sellerSummary: {
  //   type: Number,
  //   default: 0
  // },
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
