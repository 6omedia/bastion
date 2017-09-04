var express = require('express');
var session = require('express-session');
var app = express();
let mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
let bodyParser = require('body-parser');
var config = '';
var cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

if(process.env.NODE_ENV == 'test'){
	config = require('./config/test.json');
}else{
	config = require('./config/dev.json');
}

// var user = require('./controllers/user.js');

let options = { 
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
};

app.set('view engine', 'pug');
// app.set('views', __dirname + '/views');

//db connection      
mongoose.connect(config.db, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(session({
	secret: 'hhhmmmm',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(cookieParser());

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  
app.use(fileUpload());

app.use('/static', express.static('public'));

// main routes
var mainRoutes = require('./controllers/main.js');
app.use('/', mainRoutes);

// ideas routes
var ideaRoutes = require('./controllers/ideas.js');
app.use('/ideas', ideaRoutes);

// api - imagelibrary
var imageLibraryRoutes = require('./controllers/api/image_library.js');
app.use('/api/image_library', imageLibraryRoutes);

// api - tags
var tagRoutes = require('./controllers/api/tags.js');
app.use('/api/tags', tagRoutes);

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
    	message: err.message,
    	error: err
	});
});

app.listen(3000, function () {
	console.log('App running on port 3000');
});

module.exports = app;