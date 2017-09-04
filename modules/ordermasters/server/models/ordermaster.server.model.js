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
  name: {
    type: String,
    default: '',
    required: 'Please fill Ordermaster name',
    trim: true
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

mongoose.model('Ordermaster', OrdermasterSchema);
