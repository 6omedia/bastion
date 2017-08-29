process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../models/user');
let Idea = require('../../models/idea');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();

chai.use(chaiHttp);

var agent = chai.request.agent(server);

function logBillyIn(callback){

    agent
        .post('/')
        .send({ email: 'bill@billy.com', password: '123', test: true})
        .end(function (err, res) {

            var loggedInUser = res.loggedInUser;
            res.should.have.a.cookie;
            callback(agent, loggedInUser);
            
        });

}

describe('Ideas Model', () => {

    before(function(done){

        var userObj = {
            name: 'Bill',
            email: 'bill@billy.com',
            password: '123',
            confirm_password: '123',
            admin: false,
            meta: {
              age: 22,
              website: 'www.billy.com'
            }
        };

        User.remove({}, function(err){
            User.registerUser(userObj, function(err, user){
                User.registerUser({
                    name: 'George',
                    email: 'george@georgy.com',
                    password: '456',
                    confirm_password: '456',
                    admin: true,
                    meta: {
                      age: 22,
                      website: 'www.george.com'
                    }
                }, function(err, user){

                    done();
                
                });
                
            });
        });

    });

    let ideaObjFull = {
        title: 'Awesome Idea',
        text: 'This is an awesoem idea to acheive this awful problem',
        industries: ['hair dressing', 'computing', 'medical'],
        outcomes: ['do better', 'produce more'],
        elements: ['yeah', 'hmmm', 'sure'],
        publishers: ['abc', 'def']
    };

    let ideaObjIncomplete = {
        text: 'This is an awesoem idea to acheive this awful problem',
        industries: ['hair dressing', 'computing', 'medical'],
        outcomes: ['do better', 'produce more'],
        elements: ['yeah', 'hmmm', 'sure'],
        publishers: ['abc', 'def']
    };

 	describe('createIdea', () => {

        beforeEach(function(done) {
            Idea.remove({}, function(err){
                done();
            }); 
        });

        it('should have error of invalid data as title is not provided', (done) => {

            logBillyIn(function(agent){

                User.findOne({'email': 'bill@billy.com'}, function(err, user){

                    ideaObjIncomplete.user = user._id;

                    Idea.createIdea(ideaObjIncomplete, function(err, idea){
                        err.message.should.equal('Missing required data');
                        should.not.exist(idea);
                        done();
                    });

                });

            });

        });

        it('should have created idea and idea should have title of Awesome Idea', (done) => {

            logBillyIn(function(agent){

                User.findOne({'email': 'bill@billy.com'}, function(err, user){

                    ideaObjFull.user = user._id;

                    Idea.createIdea(ideaObjFull, function(err, idea){
                        idea.title.should.equal('Awesome Idea');
                        done();
                    });

                });

            });

        });

        it('should have slug that matchs awesome-idea', (done) => {

            logBillyIn(function(agent){

                User.findOne({'email': 'bill@billy.com'}, function(err, user){

                    ideaObjFull.user = user._id;

                    Idea.createIdea(ideaObjFull, function(err, idea){
                        idea.slug.should.equal('awesome-idea');
                        done();
                    });

                });

            });

        });

        // test img link was saved

        // test industry was saved

        // test outcome was saved

        // test element was saved

        // test publisher was saved

    });

    describe('updateIdea', () => {

        // return invalid data if required feilds are missing
            // title
            // slug

        // test img link was saved

        // test industry was saved

        // test outcome was saved

        // test element was saved

        // test publisher was saved

    });

});