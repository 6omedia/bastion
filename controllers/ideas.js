const express = require('express');
const ideasRoutes = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Idea = require('../models/idea');
const Tag = require('../models/tag');
const mid = require('../middleware/session');
const helpful = require('../helpers/main.js');

ideasRoutes.get('/', mid.loginRequired, function(req, res){

	User.findById(req.session.userId, function(err, user){

        if(err){
            return next(err);
        }

        Idea.find({'user': req.session.userId}, function(err, ideas){

        	if(err){
        		return next(err);
        	}

			return res.render('ideas/ideas', {
	        	name: user.name,
				userid: user._id,
				error: '',
				ideas: ideas
			});

        });

	});

});

ideasRoutes.get('/view/:ideaSlug', mid.loginRequired, function(req, res, next){

	User.findById(req.session.userId, function(err, user){

        if(err){
            return next(err);
        }

        Idea.findOne({'slug': req.params.ideaSlug}, function(err, idea){

        	if(err){
        		return next(err);
        	}

        	if(idea == null){
        		const err = new Error('Not found');
        		err.status = 404;
        		return next(err);
        	}

        	res.locals = {
	        	name: user.name,
				userid: user._id,
				mode: req.query.mode || 'view',
				error: '',
				idea: idea
			};

			return res.render('ideas/idea.pug');

        });

	});

});

ideasRoutes.post('/update/:ideaSlug', mid.jsonLoginRequired, function(req, res){

	let body = {};

	if(!req.body.title){
		res.status(400);
		body.error = 'Idea title is empty';
		return res.send(body);
	}

	User.findById(req.session.userId, function(err, user){

		if(err){
			body.error = err;
			res.status(500);
			return res.send(body);
		}

		Idea.findOne({'slug': req.params.ideaSlug}, function(err, idea){

			if(err){
				body.error = err;
				res.status(500);
				return res.send(body);
			}

			if(idea == null){
				body.error = 'Idea cant be found';
				res.status(404);
				return res.send(body);
			}

			if(idea.user.toString() != user._id.toString()){
				body.error = 'You dont have permission to update this idea';
				res.status(403);
				return res.send(body);
			}

			Idea.findOneAndUpdate(
				{"slug": req.params.ideaSlug},  
		        {
		        	$set: {
			            title: req.body.title,
			            slug: helpful.slugify(req.body.title),
			            img_src: req.body.img_src,
			            img_gallery: req.body.img_gallery || [],
				        text: req.body.text,
				        industries: req.body.industries || [],
				        outcomes: req.body.outcomes || [],
				        elements: req.body.elements || [],
				        publishers: req.body.publishers || []
		        	}
		        },
		        { new: true },
		        function(err, updated){
		            
		            if(err){
		                body.error = err;
		                res.status(err.status || 500);
		                return res.send(body);
		            }

		            body.idea = updated;
		            res.status(200);
					return res.send(body);

		        }
		    );

		});

	});

});

ideasRoutes.get('/new', mid.loginRequired, function(req, res){

	User.findById(req.session.userId, function(err, user){

        if(err){
            return next(err);
        }

		return res.render('ideas/idea_new', {
	        	name: user.name,
				userid: user._id,
				error: '',
				current_link: 'new idea'
		});

	});

});

ideasRoutes.post('/new', mid.jsonLoginRequired, function(req, res){

	let body = {};

	console.log(req.body);

	if(!req.body.title || !req.body.img_src || !req.body.text){
		res.status(400);
		body.error = 'Invalid Data';
		return res.send(body);
	}

	let ideaObj = {
		title: req.body.title,
		user: req.session.userId,
		img_src: req.body.img_src,
		img_gallery: req.body.img_gallery || [],
        text: req.body.text,
        industries: req.body.industries || [],
        outcomes: req.body.outcomes || [],
        elements: req.body.elements || [],
        publishers: req.body.publishers || []
	};

	Idea.createIdea(ideaObj, function(err, idea){

		if(err){
			body.error = err.message;
			res.status(err.status || 500);
			return res.send(body);
		}

		body.idea = idea;
		res.status(200);
		return res.send(body);	

	});

});

ideasRoutes.get('/getfiltered', mid.jsonLoginRequired, function(req, res){

	let body = {};

	const queryObj = {
		user: req.session.userId
	};

	if(req.query.industry != '')
		queryObj.industries = req.query.industry;

	if(req.query.outcome != '')
		queryObj.outcomes = req.query.outcome;

	if(req.query.element != '')
		queryObj.elements = req.query.element;

	if(req.query.publisher != '')
		queryObj.publishers = req.query.publisher;

	Idea.find(queryObj, function(err, ideas){

		if(err){
			body.error = err;
			res.status(err.status || 500);
			return res.json(body);
		}

		body.ideas = ideas;
		res.status(200);
		return res.json(body);

	});

});

ideasRoutes.delete('/:ideaSlug', mid.jsonLoginRequired, function(req, res){

	let body = {};

	Idea.findOne({'slug': req.params.ideaSlug}, function(err, idea){

		if(err){
			body.error = err.message;
			res.status(err.status || 500);
			return res.json(body);
		}

		if(!idea){
			body.error = 'Cant delete, idea not found';
			res.status(404);
			return res.json(body);
		}

		if(req.session.userId != idea.user){
			body.error = 'You do not have permission to delete this idea';
			res.status(403);
			return res.json(body);
		}

		Idea.remove({'slug': req.params.ideaSlug}, function(err, removed){

			if(err){
				body.error = err.message;
				res.status(err.status || 500);
				return res.json(body);
			}

			if(removed < 1){
				res.status(500);
				body.error = 'Something went wrong';
				return res.json(body);
			}

			Idea.find({'user': req.session.userId}, function(err, ideas){

				res.status(200);
				body.success = 'Idea Deleted';
				body.ideas = ideas;
				return res.json(body);

			});

		});

	});

});

// ideasRoutes.get('/get_ideas', mid.jsonLoginRequired, function(req, res){

	

// });

module.exports = ideasRoutes;