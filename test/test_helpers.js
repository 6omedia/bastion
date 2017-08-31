module.exports = function(User, agent) {

    var module = {};

	module.createUserAndAdmin = function(done){

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

	};

	module.logBillyIn = function(callback){

	    agent
	        .post('/')
	        .send({ email: 'bill@billy.com', password: '123', test: true})
	        .end(function (err, res) {

	            var loggedInUser = res.loggedInUser;
	            callback(agent, loggedInUser);
	            
	        });

	};

	module.logGeorgeAdminIn = function(callback){

	    agent
	        .post('/')
	        .send({ email: 'george@georgy.com', password: '456', test: true, admin: true})
	        .end(function (err, res) {

	            var loggedInUser = res.loggedInUser;
	            callback(agent, loggedInUser);
	            
	        });

	};

	return module;

};