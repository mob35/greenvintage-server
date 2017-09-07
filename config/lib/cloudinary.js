'use strict';
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'husbeaftb',
    api_key: '184176281615976',
    api_secret: 'WeRuVUHsOyTIahsQ6zxYbaJjSHw'
});

module.exports.cloudinary = cloudinary;