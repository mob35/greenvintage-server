'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Categorymaster Schema
 */
var CategorymasterSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Categorymaster name',
    trim: true
  },
  detail: {
    type: String,
    default: '',
    required: 'Please fill Categorymaster detail',
    trim: true
  },
  parent: {
    type: String,
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

mongoose.model('Categorymaster', CategorymasterSchema);
