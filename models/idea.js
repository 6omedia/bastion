const mongoose = require('mongoose');
const helpful = require('../helpers/main.js');
const Schema = mongoose.Schema;

//book schema definition
let IdeaSchema = new Schema(
    {
        date_created: {
            type: Date,
            default: new Date()
        },
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        img_src: String,
        img_gallery: Array,
        text: String,
        industries: Array,
        outcomes: Array,
        elements: Array,
        publishers: Array
    }
);

IdeaSchema.statics.createIdea = function(ideaObj, callback){

    if(!ideaObj.title){
        var error = {
            message: 'Missing required data',
            status: 400
        }
        return callback(error, null);
    }

    ideaObj.slug = helpful.slugify(ideaObj.title);

    this.create(ideaObj, function(err, idea){

        if(err){
            return callback(err, idea);
        }

        return callback(null, idea);

    });

};

IdeaSchema.statics.getFiltered = function(industry, outcome, element, publisher, callback){

    

};

IdeaSchema.statics.paginateIdeas = function(ideasPerPage, currentPage, callback){

    var totalIdeas = '';
    var offset = '';

    this.find({}).sort({$natural: 1})
        .limit(ideasPerPage)
        .offset()
        .exec(function(err, ideas){

    });

};

module.exports = mongoose.model('Idea', IdeaSchema);