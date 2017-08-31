'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Home Schema
 */
var HomeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Home name',
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

mongoose.model('Home', HomeSchema);
