const mongoose = require('mongoose');
const helpful = require('../helpers/main.js');
const Schema = mongoose.Schema;

//book schema definition
let CollectionSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        description: String,
        img_src: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        ideas: [{
            type: Schema.Types.ObjectId,
            ref: 'Idea',
            required: true
        }]
    }
);

module.exports = mongoose.model('Collection', CollectionSchema);