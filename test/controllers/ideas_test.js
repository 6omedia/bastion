process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../models/user');
let Idea = require('../../models/idea');

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

describe('Ideas Controller', () => {

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

	// GET /ideas
	describe('GET /ideas', () => {

		it('should redirect as no one is logged in', (done) => {

			chai.request(server)
                .get('/ideas')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

		});

		it('should render ideas page', (done) => {

			logBillyIn(function(agent){

                agent.get('/ideas')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.header('content-type', 'text/html; charset=utf-8');
                        done();
                    });

            });

		});

	});

	describe('GET /ideas/view/:ideaSlug', () => {

		it('should redirect as no one is logged in', (done) => {

			chai.request(server)
                .get('/ideas/view/awesome-idea')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

		});

		it('should render idea page with status 200', (done) => {

			logBillyIn(function(agent){

                agent.get('/ideas/view/awesome-idea')
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });

            });

		});

		it('should return 404 not found', (done) => {

			logBillyIn(function(agent){

                agent.get('/ideas/view/slug-is-not-real')
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });

            });

		});

	});

	describe('GET /ideas/new', () => {

		it('should redirect as no one is logged in', (done) => {

			chai.request(server)
                .get('/ideas/new')
                .end((err, res) => {
                    res.should.redirect;
                    done();
                });

		});

		it('should render new idea page with status 200', (done) => {

			logBillyIn(function(agent){

                agent.get('/ideas/new')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.header('content-type', 'text/html; charset=utf-8');
                        done();
                    });

            });

		});

	});

	describe('POST /ideas/new', () => {

		let ideaObjFull = {
	        title: 'Now this really is an idea',
	        text: 'So this idea is like the idea',
	        img_src: 'img/vfdnkvfd.png',
	        industries: ['hair dressing', 'computing', 'medical'],
	        outcomes: ['do better', 'produce more'],
	        elements: ['yeah', 'hmmm', 'sure'],
	        publishers: ['abc', 'def']
	    };

	    let ideaObjIncomplete = {
	        text: 'So this idea is like the idea',
	        img_src: 'img/vfdnkvfd.png',
	        industries: ['hair dressing', 'computing', 'medical'],
	        outcomes: ['do better', 'produce more'],
	        elements: ['yeah', 'hmmm', 'sure'],
	        publishers: ['abc', 'def']
	    };

	    let ideaObjAwful = {
	    	title: 'Now this really is an idea',
	        text: 'So this idea is like the idea',
	        industries: 34,
	        outcomes: '323423',
	        elements: ['yeah', 'hmmm', 'sure'],
	        publishers: ['abc', 'def']
	    };

		it('should return 401 unathorized as no one is logged in', (done) => {

			chai.request(server)
                .post('/ideas/new')
                .send(ideaObjFull)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });

		});

		it('should return 400 as title is missing or invalid', (done) => {

			logBillyIn(function(agent){

                agent.post('/ideas/new')
                	.send(ideaObjIncomplete)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.error.should.equal('Invalid Data');
                        done();
                    });

            });

		});

		it('should return 400 as data is missing or invalid', (done) => {

			logBillyIn(function(agent){

                agent.post('/ideas/new')
                	.send(ideaObjAwful)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.error.should.equal('Invalid Data');
                        done();
                    });

            });

		});

		it('should add new idea and the new idea should have a user', (done) => {

			logBillyIn(function(agent){

				User.findOne({'email': 'bill@billy.com'}, function(err, bill){

					agent.post('/ideas/new')
                	.send(ideaObjFull)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.not.have.property('error');
                        res.body.idea.user.toString().should.equal(bill._id.toString());
                        done();
                    });

				});

            });

		});

		it('should add new idea and the new ideas title should equal "Now this really is an idea"', (done) => {

			logBillyIn(function(agent){

				agent.post('/ideas/new')
                	.send(ideaObjFull)
                    .end((err, res) => {
                        res.body.idea.title.should.equal('Now this really is an idea');
                        done();
                    });

            });

		});

		it('should add new idea and the new ideas slug should equal "now-this-really-is-an-idea"', (done) => {

			logBillyIn(function(agent){

				agent.post('/ideas/new')
                	.send(ideaObjFull)
                    .end((err, res) => {
                        res.body.idea.slug.should.equal('now-this-really-is-an-idea');
                        done();
                    });

            });

		});

	});

	// POST /ideas/update/:ideaSlug
	describe('POST /ideas/update/:ideaSlug', () => {

		let ideaObjUpdate = {
	        title: 'Awesome Idea',
	        text: 'Updated text',
	        img_src: 'vfvfdvfdvdfv',
	        industries: ['hair dressing', 'computing', 'medical'],
	        outcomes: ['do better', 'produce more', 'new outcome'],
	        elements: ['yeah', 'hmmm', 'sure'],
	        publishers: ['abc', 'def']
	    };

	    let ideaObjUpdateIncomplete = {
	    	title: '',
	        text: 'Updated text',
	        industries: ['hair dressing', 'computing', 'medical'],
	        outcomes: ['do better', 'produce more'],
	        elements: ['yeah', 'hmmm', 'sure'],
	        publishers: ['abc', 'def']
	    };

	    let ideaObjUpdateAwful = {
	    	title: 'Awesome Idea',
	        text: 'Updated text',
	        industries: 34,
	        outcomes: '323423',
	        elements: ['yeah', 'hmmm', 'sure'],
	        publishers: 456
	    };

	    let ideaObjUpdateSomethingCool = {
	        title: 'Something Really Cool',
	        text: 'Updated text',
	        industries: ['hair dressing', 'computing', 'shoes'],
	        outcomes: ['do better', 'produce more'],
	        elements: ['yeah', 'hmmm', 'sure'],
	        publishers: ['abc', 'def']
	    };

		it('should return unathorized as no one is logged in', (done) => {

			chai.request(server)
				.post('/ideas/update/awesome-idea')
            	.send(ideaObjUpdate)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });

		});

		it('should return status 404 as no idea can be found with that slug', (done) => {

			logBillyIn(function(agent){

				agent.post('/ideas/update/slug-is-not-real')
                	.send(ideaObjUpdate)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.error.should.equal('Idea cant be found');
                        done();
                    });

            });

		});

		it('should update idea as user is logged in', (done) => {

			logBillyIn(function(agent){

				agent.post('/ideas/update/awesome-idea')
                	.send(ideaObjUpdate)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.idea.text.should.equal('Updated text');
                        done();
                    });

            });

		});

		it('should not update as idea is not the users and return 403', (done) => {

			logBillyIn(function(agent){

				agent.post('/ideas/update/georges-idea')
                	.send(ideaObjUpdate)
                    .end((err, res) => {
                        res.should.have.status(403);
                        res.body.error.should.equal('You dont have permission to update this idea');
                        done();
                    });

            });

		});

		it('should not update idea as title is empty', (done) => {

			logBillyIn(function(agent){

				agent.post('/ideas/update/awesome-idea')
                	.send(ideaObjUpdateIncomplete)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.not.have.property('idea');
                        res.body.error.should.equal('Idea title is empty');
                        done();
                    });

            });

		});

		it('should update Something Cool, title and slug should equal "Something Really Cool", "something-really-cool" and industries should include "shoes"', (done) => {

			logBillyIn(function(agent){

				agent.post('/ideas/update/something-cool')
                	.send(ideaObjUpdateSomethingCool)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('idea');
                        res.body.idea.title.should.equal('Something Really Cool');
                        res.body.idea.slug.should.equal('something-really-cool');
                        res.body.idea.industries.length.should.equal(3);
                        // expect(res.body.idea.industries).to.be.an('array').that.contains.something.like('shoes');
                        done();
                    });

            });

		});

	});

	// POST /ideas/getfiltered
	describe('GET /ideas/getfiltered', () => {

		it('should return unauthorized as no one is logged in', (done) => {

			chai.request(server)
                .get('/ideas/getfiltered?industry=farming&outcome=&element=&publisher=')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.error.should.equal('unauthorized');
                    done();
                });

		});

		it('should return json', (done) => {

			logBillyIn(function(agent){

				agent.get('/ideas/getfiltered?industry=farming&outcome=&element=&publisher=')
                    .end((err, res) => {
                        res.should.have.header('content-type', 'application/json; charset=utf-8');
                        done();
                    });

            });			

		});

		it('filters by industry "farming", and should return 2 ideas', (done) => {

			logBillyIn(function(agent){

				agent.get('/ideas/getfiltered?industry=farming&outcome=&element=&publisher=')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.ideas.length.should.equal(2);
                        done();
                    });

            });			

		});

		it('filters by outcome "take over the world", and should return 3 ideas', (done) => {

			logBillyIn(function(agent){

				agent.get('/ideas/getfiltered?industry=&outcome=take+over+the+world&element&publisher=')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.ideas.length.should.equal(3);
                        done();
                    });

            });	

		});

		it('filters by element "yeah", and should return 7 ideas', (done) => {

			logBillyIn(function(agent){

				agent.get('/ideas/getfiltered?industry=&outcome=&element=yeah&publisher=')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.ideas.length.should.equal(7);
                        done();
                    });

            });				

		});

		it('filters by publisher "ghi", and should return 2 ideas', (done) => {

			logBillyIn(function(agent){

				agent.get('/ideas/getfiltered?industry=&outcome=&element=&publisher=ghi')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.ideas.length.should.equal(2);
                        done();
                    });

            });				

		});

		it('filters by publishers "ghi" and industry "bakeing", and should return 1 ideas with title Website Idea', (done) => {

			logBillyIn(function(agent){

				agent.get('/ideas/getfiltered?industry=bakeing&outcome=&element=&publisher=ghi')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.ideas.length.should.equal(1);
                        res.body.ideas[0].title.should.equal('Website Idea');
                        done();
                    });

            });			

		});

	});

	// DELETE /ideas/:ideaSlug
	describe('DELETE /ideas/:ideaSlug', () => {

		it('should return 404 not found as slug doesnt exist', (done) => {

			logBillyIn(function(agent){

				agent.delete('/ideas/slug-is-not-real')
                    .end((err, res) => {
                        res.should.have.status(404);
	                    res.body.error.should.equal('Cant delete, idea not found');
                        done();
                    });

            });	

		});

		it('should return 401 unathorized as user not logged in', (done) => {

			chai.request(server)
                .delete('/ideas/awesome-idea')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.error.should.equal('unauthorized');
                    done();
                });

		});

		it('should not delete and return 403 forbidden as idea is not logged in users', (done) => {

			logBillyIn(function(agent){

				agent.delete('/ideas/georges-idea')
                    .end((err, res) => {
                        res.should.have.status(403);
	                    res.body.error.should.equal('You do not have permission to delete this idea');
                        done();
                    });

            });	

		});

		it('should delete idea as user is logged in', (done) => {

			logBillyIn(function(agent){

				agent.delete('/ideas/awesome-idea')
                    .end((err, res) => {
                        res.should.have.status(200);
	                    res.body.should.not.have.property('error');

	                    Idea.find({'slug': 'awesome-idea'}, function(err, idea){
	                    	idea.should.be.empty;
	                    	done();
	                    });
                    });

            });	

		});

	});

});