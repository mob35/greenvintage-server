'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Address = mongoose.model('Address'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    address;

/**
 * Address routes tests
 */
describe('Address By user tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        // Save a user to the test db and create new Address
        user.save(function () {
            address = {
                firstname: 'Address firstname',
                lastname: 'Address lastname',
                address: 'Address address',
                subdistrict: 'Address subdistrict',
                district: 'Address district',
                province: 'Address province',
                postcode: 'Address postcode'
            };

            done();
        });
    });

    it('should be able to get a Address by user if logged in', function (done) {
        var addressObj = new Address({
            firstname: 'Address firstname',
            lastname: 'Address lastname',
            address: 'Address address',
            subdistrict: 'Address subdistrict',
            district: 'Address district',
            province: 'Address province',
            postcode: 'Address postcode',
            user: user
        });
        var addressObj2 = new Address({
            firstname: 'Address firstname2',
            lastname: 'Address lastname2',
            address: 'Address address2',
            subdistrict: 'Address subdistrict2',
            district: 'Address district2',
            province: 'Address province2',
            postcode: 'Address postcode2',
            user: null
        });
        addressObj.save();
        addressObj2.save();
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Get a list of Addresses
                agent.get('/api/addressbyuser/' + user.id)
                    .end(function (addressesGetErr, addressesGetRes) {
                        // Handle Addresses save error
                        if (addressesGetErr) {
                            return done(addressesGetErr);
                        }

                        // Get Addresses list
                        var addresses = addressesGetRes.body.address;

                        // Set assertions
                        (addresses.length).should.equal(1);
                        (addresses[0].user._id).should.equal(userId);
                        (addresses[0].firstname).should.match('Address firstname');
                        (addresses[0].lastname).should.match('Address lastname');
                        (addresses[0].address).should.match('Address address');
                        (addresses[0].subdistrict).should.match('Address subdistrict');
                        (addresses[0].district).should.match('Address district');
                        (addresses[0].province).should.match('Address province');
                        (addresses[0].postcode).should.match('Address postcode');

                        // Call the assertion callback
                        done();
                    });
            });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Address.remove().exec(done);
        });
    });
});
