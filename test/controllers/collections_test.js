process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../models/user');
let Idea = require('../../models/idea');
let Collection = require('../../models/collection');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();
// let expect = chai.expect();
let async = require('async');

const ideasData = require('../data/ideas.json');

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

function logGeorgeAdminIn(callback){

    agent
        .post('/')
        .send({ email: 'george@georgy.com', password: '456', test: true, admin: true})
        .end(function (err, res) {

            var loggedInUser = res.loggedInUser;
            res.should.have.a.cookie;
            callback(agent, loggedInUser);
            
        });

}

describe('Collections Controller', () => {

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

	beforeEach(function(done){
		User.findOne({'email': 'bill@billy.com'}, function(err, user){
			Idea.remove({}, function(err){
	     		let count = 1;
			 	async.each(ideasData, function(idea, callback){
			 		idea.user = user._id;
			 		Idea.createIdea(idea, function(err, idea){
			 			
			 			if(err){
			 				console.log('ERROR! ', err);
			 			}

			 			if(count == ideasData.length){

			 				User.findOne({'email': 'george@georgy.com'}, function(err, george){

			 					Idea.createIdea({
			 						title: "Georges Idea",
			 				        text: "This is an awesoem idea to acheive this awful problem",
			 				        user: george._id,
							        industries: ["hair dressing", "computing", "farming"],
							        outcomes: ["take over the world", "produce more"],
							        elements: ["sure"],
							        publishers: ["abc", "def"]
								}, function(err, gIdea){

									done();	
									
			 					});

			 				});	

			 			}else{

			 				count++;
	 						callback();

			 			}
					});
			 	});
			});
		});
	});

	// rendered routes

	describe('GET /collections', () => {

		it('should redirect as no one logged in', (done) => {

			chai.request(server)
                .get('/collections')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

		});

		it('should return 200 and render the collections page', (done) => {
			
			logBillyIn(function(agent){

                agent.get('/collections')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.header('content-type', 'text/html; charset=utf-8');
                        done();
                    });

            });

		});

	});

	describe('GET /collections/new', () => {

		it('should redirect as no one logged in', (done) => {

			chai.request(server)
                .get('/collections/new')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

		});

		it('should return 200 and render the new collection page', (done) => {
			
			logBillyIn(function(agent){

                agent.get('/collections/new')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.header('content-type', 'text/html; charset=utf-8');
                        done();
                    });

            });
			
		});

	});

	describe('GET /collections/view/:slug', (done) => {

		before(function(done){

			User.findOne({'email': 'bill@billy.com'}, function(err, user){

				Idea.createIdea({
					title: "Georges Idea",
			        text: "This is an awesoem idea to acheive this awful problem",
			        user: user._id,
			        industries: ["hair dressing", "computing", "farming"],
			        outcomes: ["take over the world", "produce more"],
			        elements: ["sure"],
			        publishers: ["abc", "def"]
				}, function(err, idea){
					Collection.create({
						title: 'Yeah Collection',
					    slug: 'yeah-collection',
					    description: 'hji jk jkdscnsd cjkds ckjds cjkds',
					    img_src: 'vdsjnk/vdsv.png',
					    user: user._id,
					    ideas: [idea._id] 
					}, function(err, collection){
						if(err){
							console.log('ERR ', err);
						}
						done();
					});
				});

			});

		});

		after(function(done){
			Collection.remove({}, function(err){
				if(err){
					console.log('ERR ', err);
				}
				Idea.remove({}, function(err){
					if(err){
						console.log('ERR ', err);
					}
					done();
				});
			});
		});

		it('should redirect as no one logged in', (done) => {

			chai.request(server)
                .get('/collections/view/yeah-collection')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

		});

		it('should redirect as not logged in users collection', (done) => {

			logGeorgeAdminIn(function(agent){

                agent.get('/collections/view/yeah-collection')
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });

            });

		});

		it('should redirect to a 404 page as the collection doesnt exist', (done) => {
			
			logBillyIn(function(agent){

                agent.get('/collections/view/no-collection')
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });

            });
			
		});

		it('should return 200 and render the new collection page', (done) => {
			
			logBillyIn(function(agent){

                agent.get('/collections/view/yeah-collection')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.header('content-type', 'text/html; charset=utf-8');
                        done();
                    });

            });
			
		});

	});

	describe('GET /collections/edit/:slug', () => {

		before(function(){

			User.findOne({'email': 'bill@billy.com'}, function(err, user){

				Idea.createIdea({
					title: "Georges Idea",
			        text: "This is an awesoem idea to acheive this awful problem",
			        user: user._id,
			        industries: ["hair dressing", "computing", "farming"],
			        outcomes: ["take over the world", "produce more"],
			        elements: ["sure"],
			        publishers: ["abc", "def"]
				}, function(err, idea){

					// console.log('IDEA ', idea);

					Collection.create({
						title: 'Yeah Collection',
					    slug: 'yeah-collection',
					    description: 'hji jk jkdscnsd cjkds ckjds cjkds',
					    img_src: 'vdsjnk/vdsv.png',
					    user: user._id,
					    ideas: [idea._id] 
					}, function(err, collection){
						if(err){
							console.log('ERR ', err);
						}
					});
				});

			});

		});

		after(function(){
			Collection.remove({}, function(err){
				if(err){
					console.log('ERR ', err);
				}
				Idea.remove({}, function(err){
					if(err){
						console.log('ERR ', err);
					}
				});
			});
		});

		it('should redirect as no one logged in', (done) => {

			chai.request(server)
                .get('/collections/edit/yeah-collection')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

		});

		it('should redirect to a 404 page as the collection doesnt exist', (done) => {
			
			logBillyIn(function(agent){

                agent.get('/collections/edit/no-collection')
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });

            });
			
		});

		it('should return 200 and render the new collection page', (done) => {
			
			logBillyIn(function(agent){

                agent.get('/collections/edit/yeah-collection')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.header('content-type', 'text/html; charset=utf-8');
                        done();
                    });

            });
			
		});

	});

	// api routes

	// describe('GET /collections/all', () => {
	// 	// returns all collections
	// });

	// describe('POST /collections/new', () => {
		
	// });

	// describe('POST /collections/edit', () => {
		
	// });

	// describe('DELETE /collections/:id', () => {
		
	// });

});