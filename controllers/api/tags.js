const express = require('express');
const tagRoutes = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/user');
const Tag = require('../../models/tag');
const mid = require('../../middleware/session');
const helpful = require('../../helpers/main.js');

tagRoutes.get('/:field', mid.jsonLoginRequired, function(req, res){

	var body = {};

	User.findById(req.session.userId, function(err, user){

		if(err){
			body.error = err.message;
			res.status(err.status || 500);
			return res.json(body);
		}	

		Tag.find({
			'field': req.params.field,
			'userId': req.session.userId
		}, function(err, tags){

			if(err){
				body.error = err.message;
				res.status(err.status || 500);
				return res.json(body);
			}

			body.tags = tags;
			res.status(200);
			return res.json(body);

		});

	});

});

tagRoutes.get('/search/:field/:term', mid.jsonLoginRequired, function(req, res){

	var body = {};

	if(req.params.term == undefined){
		body.tags = [];
		res.status(200);
		return res.json(body);
	}

	User.findById(req.session.userId, function(err, user){

		if(err){
			body.error = err.message;
			res.status(err.status || 500);
			return res.json(body);
		}	

		Tag.find({
		 		'field': req.params.field,
		 		'userId': req.session.userId,
		 		'name': new RegExp(req.params.term, 'i')
		 	}, function(err, tags){

				if(err){
					body.error = err.message;
					res.status(err.status || 500);
					return res.json(body);
				}

				body.tags = tags;
				res.status(200);
				return res.json(body);

		});

	});

});

tagRoutes.post('/add_tag', mid.jsonLoginRequired, function(req, res){

	var body = {};

	User.findById(req.session.userId, function(err, user){

		if(err){
			body.error = err.message;
			res.status(err.status || 500);
			return res.send(body);
		}	

		if(!req.body.name || !req.body.field){
			body.error = 'missing fields';
			res.status(400);
			return res.send(body);
		}

		Tag.find({
			'name': req.body.name,
			'field': req.body.field,
			'userId': req.session.userId
		}, function(err, tags){

			if(err){
				body.error = err.message;
				res.status(err.status || 500);
				return res.send(body);
			}

			if(tags.length > 0){
				body.message = 'Tag allready exists';
				res.status(200);
				return res.send(body);
			}

			Tag.create({
				name: req.body.name,
				field: req.body.field,
				userId: req.session.userId
			}, function(err, tag){

				if(err){
					body.error = err.message;
					res.status(err.status || 500);
					return res.send(body);
				}

				console.log(err, tag);

				body.tag = tag;
				res.status(200);
				return res.send(body);

			});

		});

	});

});

module.exports = tagRoutes;