const express = require('express')
const {
    getQuestions,
    getQuestion,
    createQuestion,
    deleteQuestion,
    updateQuestion
} = require('../controllers/questionController')

const router = express.Router()
//const authenticateToken = require('../middleware/authorization'); // Import the middleware

// Apply the authenticateToken middleware to all routes below
//router.use(authenticateToken);

// GET all questions
router.get('/', getQuestions)

// GET a single question
router.get('/:id', getQuestion)

// POST a new question
router.post('/', createQuestion)

// DELETE a new question
router.delete('/:id', deleteQuestion)

// UPDATE a new question
router.patch('/:id', updateQuestion)

module.exports = router