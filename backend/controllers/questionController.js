// Container controller functions for each route (get,post,delete,patch)
// We can call those function directly in question.js

const Question = require('../models/questionModel')
const mongoose = require('mongoose')


// get all questions
const getQuestions = async (req, res) => {
    const questions = await Question.find({}).sort({ createdAt: 1 })

    res.status(200).json(questions)
}

// get a single question
const getQuestion = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such question' })
    }

    const question = await Question.findById(id)

    if (!question) {
        return res.status(404).json({ error: 'Question not found' })
    }

    res.status(200).json(question)
}

// create a new question
const createQuestion = async (req, res) => {
    const { title, complexity, category, description } = req.body

    console.log(req.body)
    let emptyFields = []

    if(!title){
        emptyFields.push('title')
        console.log('title empty')
    }
    if(!complexity){
        emptyFields.push('complexity')
        console.log('complexity empty')
    }
    if(!category){
        emptyFields.push('category')
        console.log('category empty')
    }
    if(!description){
        emptyFields.push('description')
        console.log('description empty')
    }
    if(emptyFields.length > 0){
        console.log(emptyFields)
        return res.status(400).json({ error: 'Please fill in all the fieldss', emptyFields })
    }

    //add doc to db
    try {
        const question = await Question.create({ title, complexity, category, description })
        res.status(200).json(question)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a question
const deleteQuestion = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such question' }) //404 is not found
    }

    const question = await Question.findOneAndDelete({ _id: id })

    if (!question) {
        return res.status(400).json({ error: 'Question not found' }) //400 is bad request
    }

    res.status(200).json(question) //200 is ok
}

// update a question
const updateQuestion = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such question' })
    }

    const question = await Question.findOneAndUpdate({ _id: id }, {
        ...req.body // ... spread operator to get all the fields from the request body
    })

    if (!question) {
        return res.status(400).json({ error: 'Question not found' })
    }

    res.status(200).json(question)
}

module.exports = {
    getQuestions,
    getQuestion,
    createQuestion,
    deleteQuestion,
    updateQuestion
}