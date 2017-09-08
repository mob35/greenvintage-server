'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Productmaster = mongoose.model('Productmaster'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Productmaster
 */
exports.create = function(req, res) {
    var productmaster = new Productmaster(req.body);
    productmaster.user = req.user;

    productmaster.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(productmaster);
        }
    });
};

/**
 * Show the current Productmaster
 */

exports.read = function(req, res) {
    // convert mongoose document to JSON
    var productmaster = req.productmaster ? req.productmaster.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    productmaster.isCurrentUserOwner = req.user && productmaster.user && productmaster.user._id.toString() === req.user._id.toString();

    res.jsonp(productmaster);
};

/**
 * Update a Productmaster
 */
exports.update = function(req, res) {
    var productmaster = req.productmaster;

    productmaster = _.extend(productmaster, req.body);

    productmaster.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(productmaster);
        }
    });
};

/**
 * Delete an Productmaster
 */
exports.delete = function(req, res) {
    var productmaster = req.productmaster;

    productmaster.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(productmaster);
        }
    });
};

/**
 * List of Productmasters
 */
exports.list = function(req, res) {
    Productmaster.find().sort('-created').populate('user', 'displayName').populate('shop').populate('category').populate('size').populate('shippings.shipping').exec(function(err, productmasters) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(productmasters);
        }
    });
};

/**
 * Productmaster middleware
 */
exports.productmasterByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Productmaster is invalid'
        });
    }

    Productmaster.findById(id)
        .populate('user')
        .populate('shop')
        .populate('category')
        .populate('size')
        .populate('shippings.shipping')
        .exec(function(err, productmaster) {
            if (err) {
                return next(err);
            } else if (!productmaster) {
                return res.status(404).send({
                    message: 'No Productmaster'
                });
            }
            req.productmaster = productmaster;
            next();
        });
};

exports.productDetail = function(req, res, next) {
    res.jsonp({
        "id": "product001",
        "name": "NIKE",
        "detail": "All item(s) will be shipped",
        "price": 100,
        "image": [{
                "url": "https://assets.wired.com/photos/w_1534/wp-content/uploads/2016/09/ff_nike-hyperadapt_angle_front.jpg",
                "id": "img001"
            },
            {
                "url": "http://www.sportsdirect.com/images/marketing/nikelanding-tainers.jpg",
                "id": "img002"
            }
        ],
        "review": [{
                "comment": "สินค้าตัวจริงสวยมากเลยค่ะ",
                "rate": 4.5
            },
            {
                "comment": "ถ้าได้สินค้าแล้วจะกลับมาเพิ่มดาวให้นะ",
                "rate": 1.5
            }
        ],
        "rate": 4.5,
        "qa": [{
                "question": "Qa question 1",
                "answer": "Qa answer 1"
            },
            {
                "question": "Qa question 2",
                "answer": "Qa answer 2"
            }
        ],
        "promotions": [{
            "name": "โปรโมชั่นวันวาเลนไทน์",
            "detail": "โปรโมชั่นวันวาเลนไทน์ ซื้อสินค้าจากร้านครบ 500 บาท รับกล่องเก็บรองเท้า ฟรี!!",
            "code": "promotion 1"
        }],
        "favorite": [{
            "customerid": "xxx",
            "favdate": "2017-08-05T14:05:59"
        }],
        "historyLog": [],
        "stock": {
            "stockvalue": [{
                "in": 10,
                "out": 10
            }],
            "sumin": 10,
            "sumout": 10,
            "amount": 10
        },
        "qty": 40,
        "issize": true,
        "size": {
            "detail": "https://scontent-sea1-1.cdninstagram.com/t51.2885-15/s480x480/e35/13636041_639744079526778_1585487380_n.jpg?ig_cache_key=MTI5NDE4MDYzNTI4Nzk4NDAwNQ%3D%3D.2",
            "sizedetail": [{
                    "name": "S",
                    "qty": 10
                },
                {
                    "name": "M",
                    "qty": 10
                },
                {
                    "name": "L",
                    "qty": 10
                },
                {
                    "name": "XL",
                    "qty": 10
                },
                {
                    "name": "XL",
                    "qty": 10
                },
                {
                    "name": "XL",
                    "qty": 10
                },
                {
                    "name": "XL",
                    "qty": 10
                },
                {
                    "name": "XL",
                    "qty": 10
                }
            ]
        },
        "category": [{
            "name": "แฟชั่น",
            "detail": "category description",
            "subcategory": [{
                "name": "กางเกง",
                "detail": "subcategory description"
            }]
        }],
        "payment": [{
            "payment": "เก็บเงินปลายทางทั่วประเทศ"
        }],
        "shipping": [{
            "shipping": "ส่งแบบธรรมดา: ฟรี"
        }],
        "shop": {
            "shop": "Adidas Thailand",
            "rate": 4
        },
        "relationproducts": [{
                "name": "NIKE",
                "image": "https://assets.wired.com/photos/w_1534/wp-content/uploads/2016/09/ff_nike-hyperadapt_angle_front.jpg",
                "price": 100
            },
            {
                "name": "ADIDAS",
                "image": "http://th-live-01.slatic.net/p/7/adidas-men-run-shoe-duramo8-bb4656-2290-1493865078-91437671-31f932a8c992f98dc9ba8c6b4dec3f6e-catalog_233.jpg",
                "price": 100
            },
            {
                "name": "PUMA",
                "image": "http://gadgets.siamsport.co.th/wp-content/uploads/puma-nrgy-sneakers.jpg",
                "price": 100
            },
            {
                "name": "ONITSUKA",
                "image": "https://th-live-02.slatic.net/p/7/onitsuka-tiger-womens-serrano-shoes-d471l-1494928131-7120789-b60f98a3253f8a5230b4a0cf110588e1.jpg",
                "price": 100
            }
        ],
        "title": "Product Detail"
    });
};

exports.productsBytitle = function(req, res, next, title) {
    req.title = title;
    next();
};

exports.getProductlist = function(req, res, next) {
    Productmaster.find().sort('-created').exec(function(err, productmasters) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // res.jsonp(productmasters);
            req.productlist = productmasters;
            next();
        }
    });
};

exports.cookingProductlist = function(req, res, next) {
    var productmaster = req.productlist;
    var items = [];
    productmaster.forEach(function(item) {
        console.log(item);
        items.push({
            _id: item._id,
            name: item.name,
            image: item.image && item.image.length > 0 ? item.image[0].url : 'not found image',
            price: item.price,
            normalprice: item.price,
            discount: 0,
            discounttype: '%',
            currency: 'THB',
            rate: 0,

        });
    });
    req.productlist = items;
    next();
};

exports.getProductsBytitle = function(req, res) {
    res.jsonp({
        title: req.title,
        items: req.productlist
    });
};