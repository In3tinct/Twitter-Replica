/**
 * Created by Vaibhav on 3/19/2016.
 */

/**
 * New node file
 */
var request = require('request')
    , express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('http tests', function(){

    it('should return the login if the url is correct', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not return the home page if the url is wrong', function(done){
        http.get('http://localhost:3000/homeinvalidrequest', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should login', function(done) {
        request.post(
            'http://localhost:3000/trylogin',
            { form: { username: 'admin@twitter.com',password:'password' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('should register', function(done) {
        request.post(
            'http://localhost:3000/register',
            { form: { first_name: 'mocha',last_name:'test',email:'mochatest@twitter.com',password:'password',userhandle:'mochatest'}},
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('should fetch tweets', function(done) {
        request.post(
            'http://localhost:3000/fetchtweets',
            { form: { username:'admin@twitter.com'}},
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
});