const mongoose = require('mongoose');
// const helpful = require('../helpers/main.js');
const Schema = mongoose.Schema;

//book schema definition
let TagSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        field: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model('Tag', TagSchema);