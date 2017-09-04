'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sizemaster Schema
 */
var SizemasterSchema = new Schema({
  detail: {
    type: String,
    required: 'Please fill detail size'
  },
  sizedetail: {
    type: [{
      name: {
        type: String,
        required: 'Please fill size detail name'
      }
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

mongoose.model('Sizemaster', SizemasterSchema);
