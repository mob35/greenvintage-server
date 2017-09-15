'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FavoriteSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  userproduct: {
    type: String,
    unique: 'Favorite is already'
  }
});

var HistorylogSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  detail: {
    type: String,
  },
  price: {
    type: Number,
    required: 'Please fill Product price'
  },
  promotionprice: {
    type: Number
  },
  percentofdiscount: {
    type: Number
  },
  currency: {
    type: String
  },
  images: {
    type: [String],
    required: 'Please fill Product images'
  },
  favorites: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Favorite'
    }]
  },
  reviews: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Review'
    }]
  },
  shippings: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Shipping'
    }]
  },
  categories: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Category'
    }]
  },
  cod: {
    type: Boolean,
    default: false
  },
  shop: {
    type: Schema.ObjectId,
    ref: 'Shop'
  },
  historylogs: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Historylog'
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

mongoose.model('Product', ProductSchema);
mongoose.model('Favorite', FavoriteSchema);
mongoose.model('Historylog', HistorylogSchema);