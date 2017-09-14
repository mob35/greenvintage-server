'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var PaymentSchema = new Schema({
  paymenttype: String,
  creditno: String,
  creditname: String,
  expdate: String,
  creditcvc: String,
  counterservice: String
});
/**
 * Order Schema
 */
var OrderSchema = new Schema({
  // name: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill Order name',
  //   trim: true
  // },
  shipping: {
    required: 'Please fill Order shipping',
    type: Schema.ObjectId,
    ref: 'Address'
  },
  items: {
    type: [{
      product: {
        name: String,
        image: String,
        price: Number,
        promotionprice: Number,
        percentofdiscount: Number,
        currency: String,
        shop: {
          name: String
        },
        shippings: [
          {
            shipping: {
              detail: String,
              name: String,
              price: Number
            }
          }
        ]
      },
      delivery: {
        detail: String,
        name: String,
        price: Number
      },
      qty: Number,
      amount: Number,
      discount: Number,
      totalamount: Number,
      price: Number,
      afterdiscount: Number
    }],
    required: 'Please fill Order items'
  },
  payment: {
    type: Schema.ObjectId,
    ref: 'Payment'
  },
  amount: {
    type: Number,
    required: 'Please fill Order amount'
  },
  discount: {
    type: Number,
    required: 'Please fill Order discount'
  },
  totalamount: {
    type: Number,
    required: 'Please fill Order totalamount'
  },
  tran: {
    type: Number,
    required: 'Please fill Order tran'
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

mongoose.model('Order', OrderSchema);
mongoose.model('Payment', PaymentSchema);
