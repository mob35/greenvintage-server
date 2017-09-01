'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Address Schema
 */
var AddressSchema = new Schema({
  firstname: {
    type: String,
    required: 'Please fill Address firstname',
    trim: true
  },
  lastname: {
    type: String,
    required: 'Please fill Address lastname',
    trim: true
  },
  tel: {
    type: String,
    required: 'Please fill Address tel',
    trim: true
  },
  address: {
    type: String,
    required: 'Please fill Address address',
    trim: true
  },
  subdistrict: {
    type: String,
    required: 'Please fill Address subdistrict',
    trim: true
  },
  district: {
    type: String,
    required: 'Please fill Address district',
    trim: true
  },
  province: {
    type: String,
    required: 'Please fill Address province',
    trim: true
  },
  postcode: {
    type: String,
    required: 'Please fill Address postcode',
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

mongoose.model('Address', AddressSchema);
