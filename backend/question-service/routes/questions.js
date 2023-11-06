const express = require('express')
const {
    getQuestions,
    getQuestion,
    createQuestion,
    deleteQuestion,
    updateQuestion,
    getRandomEasyQuestion,
    getRandomMediumQuestion,
    getRandomHardQuestion,
	initializeQuestions,
    getQuestionsByEasy,
    getQuestionsByMedium,
    getQuestionsByHard,
    getQuestionByTitle
} = require('../controllers/questionController')

const router = express.Router()
const authenticateToken = require('../middleware/authorization'); // Import the middleware

// GET all questions
// All authenticated users can access this route
router.get('/', getQuestions)
router.get('/random-easy', getRandomEasyQuestion)
router.get('/random-medium', getRandomMediumQuestion)
router.get('/random-hard',getRandomHardQuestion)
router.get('/all-easy', getQuestionsByEasy)
router.get('/all-medium', getQuestionsByMedium)
router.get('/all-hard', getQuestionsByHard)
router.get('/title/:title', getQuestionByTitle)
// GET a single question
// All authenticated can access this route
router.get('/:id',authenticateToken(['user', 'superuser', 'admin', 'superadmin']), getQuestion)


// POST a new question
// Only superuser, admin and superadmin can access this route
router.post('/',authenticateToken(['superuser', 'admin', 'superadmin']), createQuestion)

// DELETE a new question
// Only superuser, admin and superadmin can access this route
router.delete('/:id',authenticateToken(['superuser', 'admin', 'superadmin']), deleteQuestion)

// UPDATE a new question
// Only superuser, admin and superadmin can access this route
router.patch('/:id',authenticateToken(['superuser', 'admin', 'superadmin']), updateQuestion)

// UPDATE vote value of a question
// All authenticated can access this route
router.patch('/vote/:id',authenticateToken(['user','superuser', 'admin', 'superadmin']), updateQuestion)

module.exports = router