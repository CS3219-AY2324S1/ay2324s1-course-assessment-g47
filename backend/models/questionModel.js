//Define how question documents should be stored in the database
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    complexity: {
        type: String,
        required: true
    },
    category: {
        type: Array,
        required: true
    },
    description: {
        type: Object,
        required: true
    },
}, {timestamps: true})

// Mongoose will use "questions" as the collection name by default, unless we specify otherwise
module.exports = mongoose.model('Question', questionSchema)
//module.exports = mongoose.model('Question', questionSchema, 'questions')