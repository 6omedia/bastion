const express = require('express');
const mainRoutes = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const mid = require('../middleware/session');
const fs = require('fs');
const path = require('path');

mainRoutes.get('/', mid.loggedIn, function(req, res){

	let name = '';
	let email = '';

	res.render('signin', {
		name: name,
		email: email,
		error: ''
	});

});

mainRoutes.post('/', function(req, res){

	var error = '';

	if(req.body.email && req.body.password){

		User.authenticate(req.body.email, req.body.password, function(err, user){

			if(err || !user){

				res.status(err.status);
				return res.render('signin', {
					email: req.body.email,
					error: err
				});

			}

			// user exists

			req.session.userId = user._id;
			res.loggedInUser = user._id;

			return res.redirect('/ideas');

		});

	}else{

		error = 'Both email and password required';
		res.status(400);
		return res.render('signin', {
			email: '',
			error: error
		});

	}

});

mainRoutes.get('/logout', function(req, res){

	if (req.session) {
		// delete session object
		req.session.destroy(function(err) {
			if(err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}

});

mainRoutes.get('/profile', mid.loginRequired, function(req, res){

    User.findById(req.session.userId, function(err, user){

        if(err){
            return next(err);
        }

        return res.render('profile', {
        	id: user._id,
            name: user.name,
            email: user.email,
            age: user.meta.age,
            website: user.meta.website,
            current_link: 'edit profile'
        });

    });

});

mainRoutes.get('/register', mid.loggedIn, function(req, res){

	var name = '';
	var email = '';

    res.render('register', {
     	name: name,
     	email: email,
        error: ''
    });

});

mainRoutes.post('/register', function(req, res){

	var userObj = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password
    };

    User.registerUser(userObj, function(err, user){

        var error = '';
        var name = '';
		var email = '';

		if(req.body.name){
			name = req.body.name;
		}

		if(req.body.email){
			email = req.body.email;
		}

        if(err){
            res.status(400);
            return res.render('register', {
            	name: name,
            	email: email,
                error: err
            });
        }

        // login and start session
        req.session.userId = user._id;
        return res.redirect('/ideas');

    });

});

mainRoutes.post('/profile', mid.jsonLoginRequired, function(req, res){

	let data = {};
	data.success = '0';

	if(!req.body.userId || !req.body.email || !req.body.meta.age || !req.body.meta.website){
    	data.error = 'Invalid Data';
    	res.status(400);
    	return res.json(data);
    }

    User.isAdmin(req.session.userId, function(err, isAdmin){

    	if(!isAdmin){
    		if(req.session.userId != req.body.userId){
				data.error = 'unauthorized';
		    	res.status(403);
		    	return res.json(data);
			}
    	}

		var userObj = {
	        name: req.body.name,
	        updated_at: new Date(),
	        email: req.body.email,
	        meta: {
				age: req.body.meta.age,
				website: req.body.meta.website
	        }  
	    };

	    User.findById(req.body.userId, function(err, currentUser){

	    	if(err){
	    		data.error = 'User not found';
	            res.status(404);
				return res.json(data);
	    	}

	    	User.update({"_id": req.body.userId}, userObj, function(err, numberAffected){

				if(err){
					if (err.name === 'MongoError' && err.code === 11000) {
						data.error = 'That email address allready exists';
						return res.json(data);
		            }
		            data.error = 'User not found';
		            res.status(404);
					return res.json(data);
				}

				if(numberAffected.nModified == 0){
					data.error = 'User not found';
					res.status(404);
					return res.json(data);
				}

				if(userObj.email != currentUser.email){
					// change foldername
	    		}

				User.findById(req.body.userId, function(err, updatedUser){

					data.success = '1';
					data.updatedUser = updatedUser;
					return res.json(data);

				});

			});

	    });

    });

});

mainRoutes.delete('/profile/:userId', mid.jsonLoginRequired, function(req, res){

	let data = {};

	const userId = req.params.userId;

	User.isAdmin(req.session.userId, function(err, isAdmin){

    	if(!isAdmin){
    		if(req.session.userId != userId){
				data.error = 'unauthorized';
		    	res.status(403);
		    	return res.json(data);
			}
    	}

    	User.findByIdAndRemove(userId, function(err, user){  
    		if(err){
    			data.error = 'User ID does not exist';
    			res.status(400);
    			return res.send(data);
    		}

    		res.status(200);
		    return res.send(data);
		});

    });

});

module.exports = mainRoutes;

