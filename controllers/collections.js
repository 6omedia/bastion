const express = require('express');
const collectionRoutes = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Idea = require('../models/idea');
const Collection = require('../models/collection');
const Tag = require('../models/tag');
const mid = require('../middleware/session');
const helpful = require('../helpers/main.js');

collectionRoutes.get('/', mid.loginRequired, function(req, res){

	User.findById(req.session.userId, function(err, user){

        if(err){
            return next(err);
        }

        Collection.find({'user': req.session.userId}, function(err, collections){

        	if(err){
        		return next(err);
        	}

            return res.render('collections/collections', {
                name: user.name,
                userid: user._id,
                error: '',
                collections: collections
            });

        });

	});

});

collectionRoutes.get('/new', mid.loginRequired, function(req, res){

	User.findById(req.session.userId, function(err, user){

        if(err){
            return next(err);
        }

        Idea.find({'user': req.session.userId}).limit(20).exec(function(err, ideas){

            return res.render('collections/collection_new', {
            	name: user.name,
    			userid: user._id,
    			error: '',
                current_link: 'new collection',
                ideas: ideas
    		});

        });

	});

});

collectionRoutes.get('/view/:slug', mid.loginRequired, function(req, res, next){

	User.findById(req.session.userId, function(err, user){

        if(err){
            return next(err);
        }

        Collection.findOne({'user': req.session.userId, 'slug': req.params.slug}, function(err, collection){

        	if(err){
        		return next(err);
        	}

        	if(collection == null || collection.length == 0){
        		var err = new Error('Not Found');
        		err.status = 404;
        		return next(err);
        	}

			return res.render('collections/collection', {
	        	name: user.name,
				userid: user._id,
				error: '',
				collection: collection
			});

        });

	});

});

collectionRoutes.get('/edit/:slug', mid.loginRequired, function(req, res, next){

	User.findById(req.session.userId, function(err, user){

        if(err){
            return next(err);
        }

        Collection.findOne({'user': req.session.userId, 'slug': req.params.slug}, function(err, collection){

        	if(err){
        		return next(err);
        	}

        	if(collection == null || collection.length == 0){
        		var err = new Error('Not Found');
        		err.status = 404;
        		return next(err);
        	}

			return res.render('collections/collection_edit', {
	        	name: user.name,
				userid: user._id,
				error: '',
				collection: collection
			});

        });

	});

});

module.exports = collectionRoutes;