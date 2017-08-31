process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../../../models/user');
let Idea = require('../../../models/idea');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../app');
let should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const async = require('async');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

chai.use(chaiHttp);

var agent = chai.request.agent(server);
const testHelpers = require('../../test_helpers')(User, agent);
const logBillyIn = testHelpers.logBillyIn;

const billysFolder = path.join(__dirname, '../../..', '/public/uploads/bill@billy.com');

describe('Image Library Api', () => {

	before(function(done){
		testHelpers.createUserAndAdmin(done);
	});

	describe('POST /add_image', () => {

		beforeEach(function(done){

			if(!fs.existsSync(billysFolder)){
				fs.mkdir(billysFolder, function(err){
					if(err){
						console.log(err);
					}
					done();
				});
			}else{
				done();
			}

		});

		afterEach(function(done){

			if(fs.readdirSync(billysFolder).length > 0){
				rimraf.sync(billysFolder);
				done();
			}else{
				fs.rmdir(billysFolder, function(err){
					if(err){
						console.log(err);
					}
					done();
				});
			}

		});

		// noone logged in

		it('should return unauthorized as no one is logged in and there is no api key', (done) => {

			chai.request(server)
                .post('/api/image_library/add_image')
                .attach('image', fs.readFileSync('./test/controllers/api/img/test.png'), "test.png")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.error.should.equal('unauthorized');
                    done();
                });

		});

		// user logged in

		it('should return status of 200 as the user is logged in', (done) => {

			logBillyIn(function(agent){

                agent.post('/api/image_library/add_image')
                	.attach('image', fs.readFileSync('./test/controllers/api/img/test.png'), "test.png")
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });

            });

		});

		it('should have no error in the body', (done) => {
			
			logBillyIn(function(agent){

                agent.post('/api/image_library/add_image')
                	.attach('image', fs.readFileSync('./test/controllers/api/img/test.png'), "test.png")
                    .end((err, res) => {
                        res.body.should.not.have.property('error');
                        done();
                    });

            });

		});

		it('the image test.png should exist in the /uploads/bill@billy/test.png', (done) => {
			
			logBillyIn(function(agent){

                agent.post('/api/image_library/add_image')
                	.attach('image', fs.readFileSync('./test/controllers/api/img/test.png'), "test.png")
                    .end((err, res) => {
                        expect(fs.existsSync(path.join(__dirname, '../../..', '/public/uploads/bill@billy.com/test.png'))).to.be.true;
                        done();
                    });

            });

		});

		it('the image test(1).png should exist in the /uploads/bill@billy/test(1).png as test.png already exists', (done) => {

			logBillyIn(function(agent){

				// express uploader upload test.png
				fs.writeFileSync(billysFolder + '/test.png', "Hey there!");
 
                agent.post('/api/image_library/add_image')
                	.attach('image', fs.readFileSync('./test/controllers/api/img/test.png'), "test.png")
                    .end((err, res) => {
                        expect(fs.existsSync(path.join(__dirname, '../../..', '/public/uploads/bill@billy.com/test(1).png'))).to.be.true;
                        done();
                    });

            });

		});

		it('should return error of 400 file type is not an image', (done) => {

			logBillyIn(function(agent){

				// express uploader upload test.png
				fs.writeFileSync(billysFolder + '/test.png', "Hey there!");
 
                agent.post('/api/image_library/add_image')
                	.attach('image', fs.readFileSync('./test/controllers/api/img/test.txt'), "test.txt")
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.error.should.equal('No image property found');
                        done();
                    });

            });

		});

	});

	describe('GET /get_images', () => {

		before(function(done){
			// create images 10 images
			if(!fs.existsSync(billysFolder)){
				fs.mkdirSync(billysFolder);
			}

			for(i=1; i<21; i++){
				fs.writeFileSync(billysFolder + '/' + i + '.png', 'hmm' + i);
			}

			done();

		});

		after(function(done){

			// remove all images
			if(fs.readdirSync(billysFolder).length > 0){
				rimraf.sync(billysFolder);
				done();
			}else{
				fs.rmdir(billysFolder, function(err){
					if(err){
						console.log(err);
					}
					done();
				});
			}
		
		});

		// returns upto 12 images from the startIndex

		it('should return unauthorized as no one is logged in', (done) => {

			chai.request(server)
            .get('/api/image_library/get_images')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.error.should.equal('unauthorized');
                done();
            });

		});

		// user logged in

		it('user logged in should have 200 status', (done) => {

			logBillyIn(function(agent){
 
                agent.get('/api/image_library/get_images')
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });

            });

		});

		it('user logged in should return 20 images', (done) => {

			logBillyIn(function(agent){
 
                agent.get('/api/image_library/get_images')
                    .end((err, res) => {
                        res.body.images.length.should.equal(20);
                        done();
                    });

            });

		});

	});

	describe('DELETE /remove_image/:fileName', () => {

		beforeEach(function(done){
			if(!fs.existsSync(billysFolder)){
				fs.mkdirSync(billysFolder);
			}
			fs.writeFileSync(billysFolder + '/an_image_to_remove.png', 'hmm');
			done();
		});

		afterEach(function(done){
			if(fs.readdirSync(billysFolder).length > 0){
				rimraf.sync(billysFolder);
				done();
			}else{
				fs.rmdir(billysFolder, function(err){
					if(err){
						console.log(err);
					}
					done();
				});
			}
		});

		// no one logged in

		it('should return unauthorized as no one is logged in', (done) => {
			
			chai.request(server)
            .delete('/api/image_library/remove_image/an_image_to_remove.png')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.error.should.equal('unauthorized');
                done();
            });

		});

		it('should not remove image, image should still exist in users folder', (done) => {
			
			chai.request(server)
            .delete('/api/image_library/remove_image/an_image_to_remove.png')
            .end((err, res) => {
                expect(fs.existsSync(billysFolder + '/an_image_to_remove.png')).to.be.true;
                done();
            });

		});

		// user logged in

		it('should remove image, should not exist in users folder', (done) => {
			
			logBillyIn(function(agent){
 
                agent.delete('/api/image_library/remove_image/an_image_to_remove.png')
                    .end((err, res) => {
                        expect(fs.existsSync(billysFolder + '/an_image_to_remove.png')).to.be.false;
                        done();
                    });

            });

		});

		it('should return 400 error, image not found', (done) => {
			
			logBillyIn(function(agent){
 
                agent.delete('/api/image_library/remove_image/jkjnd.png')
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });

            });

		});

		it('should return status 200', (done) => {
			
			logBillyIn(function(agent){
 
                agent.delete('/api/image_library/remove_image/an_image_to_remove.png')
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });

            });

		});

	});

});